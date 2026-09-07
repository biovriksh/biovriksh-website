"use client";

import { useState } from "react";
import { useStudentAuth } from "@/hooks/useStudentAuth";

interface CheckoutOptions {
  pdfId?: string;
  planId?: string;
  onLoginRequired?: () => void;
  onSuccess?: () => void;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStudentAuth();

  const handleCheckout = async (options: CheckoutOptions) => {
    const { pdfId, planId, onLoginRequired, onSuccess } = options;

    // Guard: Require Student Login first!
    if (!user) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        alert("Please log in to your student account before proceeding with purchase.");
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId, planId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize order");
      }

      const { orderId, amount, currency, keyId } = data;

      // Check if Razorpay SDK script is loaded
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const razorpayOptions = {
          key: keyId,
          amount,
          currency,
          name: "Bio Vriksh",
          description: planId ? `Subscription Plan: ${planId}` : `Note Purchase: ${pdfId}`,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              // 2. Verify payment on server
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  student_id: user.id,
                  pdf_id: pdfId,
                  plan_id: planId,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Payment verification failed");
              }

              if (onSuccess) {
                onSuccess();
              } else {
                window.location.href = "/profile";
              }
            } catch (vErr: any) {
              console.error("Verification error:", vErr);
              alert(vErr.message || "Payment completed but verification failed. Please contact support.");
            }
          },
          prefill: {
            email: user.email || "",
            name: user.user_metadata?.full_name || "",
            contact: user.user_metadata?.phone || "",
          },
          theme: {
            color: "#016737",
          },
        };

        const rzp = new (window as any).Razorpay(razorpayOptions);
        rzp.open();
      } else {
        // Fallback if Razorpay SDK script is not present in local dev mode
        console.warn("Razorpay SDK script not loaded on window. Simulating direct dev purchase.");
        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderId || "order_simulated",
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: "simulated_signature",
            student_id: user.id,
            pdf_id: pdfId,
            plan_id: planId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          if (onSuccess) onSuccess();
          else window.location.href = "/profile";
        } else {
          throw new Error(verifyData.error || "Dev verification failed");
        }
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Payment initialization failed.");
      alert(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { handleCheckout, loading, error };
}
