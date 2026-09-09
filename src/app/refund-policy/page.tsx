import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund & Cancellation Policy | BioVriksh",
  description: "Refund and cancellation guidelines for BioVriksh NEET notes and subscription passes.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-[#2B2F2C]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">1. Digital Content Policy</h2>
            <p>
              At <strong>BioVriksh EdTech</strong>, we provide digital educational products, including NCERT biology short notes, chapter-wise MCQs, test series, and subscription passes. Because digital content access is granted immediately upon successful payment confirmation via <strong>Razorpay</strong>, all purchases are generally final and non-refundable once digital access is activated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">2. Subscription Cancellations</h2>
            <p>
              For recurring Monthly or Yearly passes, you can cancel your subscription renewal at any time directly from your student profile settings or by contacting support.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Effect of Cancellation:</strong> Upon cancellation, your access will remain active until the end of the current paid billing cycle. No further charges will be billed to your account.
              </li>
              <li>
                <strong>No Partial Refunds:</strong> We do not offer prorated or partial refunds for unused days in a subscription period.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">3. Technical Glitches &amp; Duplicate Payments</h2>
            <p>
              We prioritize customer satisfaction. A 100% refund will be granted under the following specific conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Duplicate Charges:</strong> If an error occurs resulting in duplicate transactions for the same note or subscription.
              </li>
              <li>
                <strong>Payment Debited but Access Not Granted:</strong> If payment was successfully debited from your account via Razorpay but account activation failed due to a technical failure.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">4. Refund Process &amp; Timeline</h2>
            <p>
              To request a refund for duplicate charges or technical failure, please email us at <strong>support@biovriksh.in</strong> with your payment receipt and Razorpay Order ID.
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-xl border border-gray-200 text-sm">
              <strong>Refund Timeline:</strong> Once approved, refunds are processed within <strong>5 to 7 business days</strong> and credited back directly to your original payment method (Bank Account, UPI, or Card) via Razorpay.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">5. Support Contact</h2>
            <p>
              For any questions regarding cancellations or refunds, please reach out to us:
            </p>
            <div className="p-4 bg-[#F6F6F6] rounded-xl border border-gray-200 text-sm">
              <p><strong>BioVriksh EdTech</strong></p>
              <p>Email: support@biovriksh.in</p>
              <p>Phone: +91 98765 43210</p>
              <p>Location: Bangalore, Karnataka, India — 560001</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
