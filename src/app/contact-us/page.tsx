import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | BioVriksh",
  description: "Get in touch with BioVriksh EdTech support team for assistance.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white text-[#2B2F2C]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-10 font-normal">
          Have questions about your subscription, NEET notes, or Razorpay payments? We are here to help!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-[#F6F6F6] border border-gray-200 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#016737] text-white shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-base mb-1">Email Support</h3>
              <p className="text-xs text-gray-500 mb-2">Send us a mail anytime</p>
              <a href="mailto:workwithbiovriksh@gmail.com" className="text-sm font-bold text-[#016737] hover:underline">
                workwithbiovriksh@gmail.com
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F6F6] border border-gray-200 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#016737] text-white shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-base mb-1">Phone &amp; WhatsApp</h3>
              <p className="text-xs text-gray-500 mb-2">Mon - Sat (9am - 7pm)</p>
              <a href="tel:+918278071134" className="text-sm font-bold text-[#016737] hover:underline">
                +91 8278071134
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F6F6] border border-gray-200 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#016737] text-white shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-base mb-1">Registered Address</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                BioVriksh EdTech<br />
                Bangalore, Karnataka<br />
                India — 560001
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F6F6] border border-gray-200 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#016737] text-white shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111827] text-base mb-1">Business Hours</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Monday to Saturday<br />
                09:00 AM – 07:00 PM IST<br />
                (Except Public Holidays)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#f6fdf0] border border-[#8BC43F]/40 text-sm">
          <h4 className="font-extrabold text-[#016737] mb-1">Payment &amp; Billing Inquiries</h4>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            For payment receipts, Razorpay transaction issues, or refund requests, please include your registered account email and Razorpay Payment ID in your message for faster resolution.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
