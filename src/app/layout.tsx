import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { SITE_CONFIG } from "@/config/site";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          
          {/* Global Footer */}
          <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="md:col-span-2">
                  <span className="text-xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                    {SITE_CONFIG.name}
                  </span>
                  <p className="mt-2 text-sm text-slate-600 max-w-sm">
                    {SITE_CONFIG.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full inline-flex border border-emerald-200">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected by Multi-Tier Anti-Fake Profile Verification</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Explore Categories</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><Link href="/?category=stay" className="hover:text-indigo-600 transition">🏨 Homestays & Rooms</Link></li>
                    <li><Link href="/?category=travel_buddy" className="hover:text-indigo-600 transition">✈️ Travel Companions (100% Free)</Link></li>
                    <li><Link href="/?category=party" className="hover:text-indigo-600 transition">🎉 Social Parties & Mixers</Link></li>
                    <li><Link href="/?category=activity" className="hover:text-indigo-600 transition">🗺️ Local Guided Tours</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Trust & Security</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><Link href="/profile/verification" className="hover:text-indigo-600 transition">Identity Verification (KYC)</Link></li>
                    <li><span className="text-slate-400">Escrow Payment Protection</span></li>
                    <li><span className="text-slate-400">Anti-Leakage Chat Guardian</span></li>
                    <li><span className="text-slate-400">$1 / ₹79 Deposit Guarantee</span></li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Inspired by BeATravelBuddy & Meetup. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Safety Guidelines</span>
                </div>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
