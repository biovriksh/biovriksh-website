/**
 * useCheckout — Razorpay payment gateway hook (stub)
 *
 * PURPOSE: This hook currently logs checkout intent to the console.
 * When you are ready to integrate Razorpay, replace the console.log
 * inside handleCheckout with your Razorpay order-creation API call
 * and the window.Razorpay SDK invocation.
 *
 * INTEGRATION GUIDE:
 * 1. Install Razorpay SDK:          npm install razorpay
 * 2. Add your Razorpay Key to .env: NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
 * 3. Create a backend API route at: /api/create-order  (POST)
 *    — accepts { price, productId }, creates a Razorpay order, returns { orderId }
 * 4. Replace the console.log below with:
 *    a) fetch('/api/create-order', { method: 'POST', body: JSON.stringify({ price, productId }) })
 *    b) const { orderId } = await res.json()
 *    c) Open the Razorpay checkout modal with that orderId
 */

export function useCheckout() {
  /**
   * handleCheckout
   * @param price     - The price string shown on the button (e.g. "₹49", "₹2400")
   * @param productId - A unique product/plan identifier (e.g. "paid-pdf-001", "plan-yearly")
   */
  function handleCheckout(price: string, productId: string) {
    // ── STUB: Replace this entire block with Razorpay integration ──
    console.log("[Bio Vriksha Checkout] Initiating payment:", {
      price,
      productId,
      timestamp: new Date().toISOString(),
    });

    // TODO: Uncomment and complete when backend is ready:
    //
    // try {
    //   const res = await fetch('/api/create-order', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ price, productId }),
    //   });
    //   const { orderId, amount, currency } = await res.json();
    //
    //   const options = {
    //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    //     amount,
    //     currency,
    //     name: 'Bio Vriksha',
    //     description: productId,
    //     order_id: orderId,
    //     handler: (response) => {
    //       console.log('[Razorpay] Payment success:', response);
    //       // Verify payment signature on server, then grant access
    //     },
    //     prefill: { name: '', email: '', contact: '' },
    //     theme: { color: '#016737' },
    //   };
    //   const rzp = new (window as any).Razorpay(options);
    //   rzp.open();
    // } catch (err) {
    //   console.error('[Bio Vriksha Checkout] Error:', err);
    // }
  }

  return { handleCheckout };
}
