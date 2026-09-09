import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping & Delivery Policy | BioVriksh",
  description: "Digital delivery policy and fulfillment details for BioVriksh NEET materials.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-[#2B2F2C]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">1. Digital Delivery Platform</h2>
            <p>
              <strong>BioVriksh EdTech</strong> is an online educational platform offering 100% digital study materials, NCERT summaries, chapter notes, and NEET practice test series.
            </p>
            <div className="p-4 bg-[#F6F6F6] rounded-xl border border-gray-200 text-sm">
              <p><strong>Note:</strong> We do NOT sell or ship any physical books, printed material, or hardware items. All products are strictly digital.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">2. Instant Fulfillment Timeframe</h2>
            <p>
              Upon successful payment authorization via <strong>Razorpay</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Instant Access:</strong> Your purchased digital notes or subscription pass will be activated <strong>immediately (within seconds)</strong> on your registered BioVriksh account.
              </li>
              <li>
                <strong>Confirmation Email:</strong> You will receive a digital payment receipt and access confirmation email at your registered email address.
              </li>
              <li>
                <strong>Access Location:</strong> Unlocked notes and test sets can be accessed anytime by logging into your account and visiting the Chapter Reader or Profile dashboard.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">3. Shipping Costs</h2>
            <p>
              Since all services are delivered digitally over the internet, there are <strong>zero shipping fees, handling charges, or hidden delivery costs</strong> associated with any purchase on BioVriksh.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">4. Delivery Issues &amp; Customer Support</h2>
            <p>
              In rare instances where network latency delays instant activation, please log out and log back into your account. If your digital access is still not updated after 15 minutes, please contact our support team with your payment transaction ID:
            </p>
            <div className="p-4 bg-[#F6F6F6] rounded-xl border border-gray-200 text-sm">
              <p><strong>BioVriksh EdTech Support</strong></p>
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
