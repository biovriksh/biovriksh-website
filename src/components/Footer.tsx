"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

function InstagramLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="igGradFooter" cx="30%" cy="107%" r="130%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#igGradFooter)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="15.25" cy="8.75" r="0.75" fill="white" />
    </svg>
  );
}

function TelegramLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#24A1DE" />
      <path
        d="M16.64 8.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.26-2.05-.48-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.66-2.89 8.01-3.45 3.81-1.59 4.6-.1 4.87.1 4.87z"
        fill="white"
      />
    </svg>
  );
}

function YoutubeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="white" />
    </svg>
  );
}

function MailLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="3.5" fill="#EA4335" />
      <path d="M4 7.5l8 5.5 8-5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#25D366" />
      <path
        d="M16.5 14.5c-.7 0-1.4-.1-2.1-.4-.3-.1-.6 0-.8.2l-1.3 1.3c-2.3-1.2-4.1-3-5.3-5.3l1.3-1.3c.2-.2.3-.5.2-.8-.2-.7-.3-1.4-.3-2.1 0-.6-.4-1-1-1H4.5c-.6 0-1 .4-1 1 0 7.2 5.8 13 13 13 .6 0 1-.4 1-1v-2.7c0-.6-.4-1-1-1z"
        fill="white"
      />
    </svg>
  );
}

function LocationLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#EA4335"
      />
      <circle cx="12" cy="9" r="2.8" fill="white" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#F4F3F0] text-[#1A1A1A] pt-16 pb-8 relative overflow-hidden border-t border-gray-200">
      
      {/* Background subtle organic vector lines (Matching reference screenshot) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full text-gray-400" viewBox="0 0 1440 600" fill="none">
          <path d="M-100 100 C400 300, 800 -100, 1500 200" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-50 400 C600 100, 900 500, 1500 300" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* ── TOP ESSENTIAL COLUMNS GRID (NO QUICK LINKS) ────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 pb-16">
          
          {/* COL 1: CONNECT */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Connect
            </span>
            <ul className="flex flex-col gap-3 font-medium text-sm text-[#2B2F2C]">
              <li>
                <a
                  href="https://instagram.com/biovriksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#016737] transition-colors group"
                >
                  <InstagramLogo className="w-5 h-5 group-hover:scale-110 transition-transform shadow-xs" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/biovriksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#016737] transition-colors group"
                >
                  <TelegramLogo className="w-5 h-5 group-hover:scale-110 transition-transform shadow-xs" />
                  <span>Telegram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@biovriksha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#016737] transition-colors group"
                >
                  <YoutubeLogo className="w-5 h-5 group-hover:scale-110 transition-transform shadow-xs" />
                  <span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COL 2: CONTACT / REACH OUT */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Contact
            </span>
            <div className="flex flex-col gap-3 text-sm text-[#2B2F2C] font-medium">
              <p className="font-bold text-[#1A1A1A]">Reach out</p>
              <a
                href="mailto:support@biovriksha.in"
                className="inline-flex items-center gap-2.5 hover:text-[#016737] transition-colors group"
              >
                <MailLogo className="w-5 h-5 group-hover:scale-110 transition-transform shadow-xs" />
                <span>support@biovriksha.in</span>
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2.5 hover:text-[#016737] transition-colors group"
              >
                <PhoneLogo className="w-5 h-5 group-hover:scale-110 transition-transform shadow-xs" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* COL 3: OFFICE / LOCATION */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Location
            </span>
            <div className="text-sm text-[#4B5563] leading-relaxed font-medium">
              <p className="font-bold text-[#1A1A1A] inline-flex items-center gap-2.5 mb-1">
                <LocationLogo className="w-5 h-5 shadow-xs" />
                <span>BioVriksha EdTech</span>
              </p>
              <p className="pl-7">Bangalore, Karnataka</p>
              <p className="pl-7">India — 560001</p>
            </div>
          </div>

        </div>

        {/* ── GIANT DISPLAY BRANDING LOGO (Matching Reference Screenshot) ── */}
        <div className="pt-6 pb-4 border-t border-gray-300/60 overflow-hidden select-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[165px] font-black text-[#1A1A1A] tracking-tighter leading-none uppercase font-sans text-center sm:text-left"
          >
            BioVriksha
          </motion.h1>
        </div>

        {/* ── BOTTOM LEGAL & COPYRIGHT BAR ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-gray-500 font-medium border-t border-gray-200">
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#1A1A1A] transition-colors">
              Terms &amp; Conditions
            </a>
          </div>

          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} BioVriksha EdTech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
