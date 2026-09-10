import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions | BioVriksh",
  description: "Terms of service and user agreements for BioVriksh NEET preparation platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white text-[#2B2F2C]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website and digital educational services provided by <strong>BioVriksh EdTech</strong> (&quot;BioVriksh,&quot; &quot;we,&quot; or &quot;us&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you must not use our website or purchase our digital content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">2. User Accounts &amp; Registration</h2>
            <p>
              To access paid NEET study materials, short notes, and practice question sets, you must register for a BioVriksh student account. You are responsible for maintaining the confidentiality of your credentials and for all activities conducted under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">3. Intellectual Property Rights</h2>
            <p>
              All content on BioVriksh—including NCERT line-by-line summaries, short notes, practice MCQs, test series, graphics, logos, and digital reader tools—is the exclusive property of BioVriksh EdTech. Unauthorized reproduction, distribution, resale, or unauthorized sharing of paid study materials is strictly prohibited and subject to legal action.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">4. Pricing &amp; Payments</h2>
            <p>
              All prices listed on BioVriksh are in Indian Rupees (INR). Payments are processed securely via <strong>Razorpay Payment Gateway</strong>. BioVriksh reserves the right to revise pricing for subscriptions and notes at any time without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">5. Usage Guidelines</h2>
            <p>Users agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Use automated scripts or scrapers to extract educational content or PDFs.</li>
              <li>Attempt to bypass security measures of our secure digital reader.</li>
              <li>Share login accounts with multiple users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">6. Contact Information</h2>
            <div className="p-4 bg-[#F6F6F6] rounded-xl border border-gray-200 text-sm">
              <p><strong>BioVriksh EdTech</strong></p>
              <p>Email: workwithbiovriksh@gmail.com</p>
              <p>Phone: +91 8278071134</p>
              <p>Location: Bangalore, Karnataka, India — 560001</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
