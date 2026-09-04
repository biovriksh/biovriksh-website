import type { Metadata } from "next";
import { Poppins, Bodoni_Moda, Alex_Brush, Permanent_Marker } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bodoni",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex",
});

const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marker",
});

export const metadata: Metadata = {
  title: "Bio Vriksha | Ultra-Aesthetic NEET Biology Learning & Practice Platform",
  description: "Free concept notes for every chapter. Paid practice sets that mirror the NEET exam pattern.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${poppins.variable} ${bodoni.variable} ${alexBrush.variable} ${marker.variable} font-sans h-full antialiased`} style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#111827] selection:bg-[#8BC43F] selection:text-[#016737]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

