import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | BioVriksh",
  description: "Privacy Policy and Data Protection guidelines for BioVriksh NEET preparation platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-[#2B2F2C]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">1. Introduction</h2>
            <p>
              BioVriksh EdTech (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting the personal data of our users (&quot;student,&quot; &quot;user,&quot; or &quot;you&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <strong>biovriksh.in</strong> or use our NEET preparation platform and digital services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone number, and account credentials when you register for a free or paid student account.
              </li>
              <li>
                <strong>Payment Information:</strong> Financial data such as UPI IDs, credit/debit card details, or banking details processed securely through our payment gateway partner, <strong>Razorpay</strong>. We do not store raw payment card data on our servers.
              </li>
              <li>
                <strong>Usage & Device Data:</strong> Information about your browser type, device details, IP address, and pages accessed to optimize content delivery and secure reader performance.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>To provide, operate, and maintain our NEET study platform and secure PDF reader.</li>
              <li>To process transactions, subscriptions, and issue payment confirmations via Razorpay.</li>
              <li>To authenticate user accounts and prevent unauthorized access or content piracy.</li>
              <li>To communicate important updates, technical support, and subscription notices.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">4. Payment Security & Third-Party Processing</h2>
            <p>
              All online payments on BioVriksh are handled through <strong>Razorpay Payment Gateway</strong>. Razorpay adheres to PCI-DSS standards managed by the PCI Security Standards Council. Your payment credentials are encrypted using industry-standard SSL technology during transmission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">5. Data Protection & Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111827]">6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our support team at:
            </p>
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
