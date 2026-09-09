"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  FileText,
  ShoppingCart,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Exclude auth check on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    async function checkAdminAuth() {
      if (typeof window !== "undefined") {
        // 1. Check local admin token
        const localToken = localStorage.getItem("biovriksh_admin_token");
        if (localToken) {
          setIsAuthorized(true);
          setIsCheckingAuth(false);
          return;
        }

        // 2. Fallback check Supabase Auth admin role
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();

            if (profile?.role === "admin") {
              setIsAuthorized(true);
              setIsCheckingAuth(false);
              return;
            }
          }
        } catch (e) {
          console.error("Admin auth verification error:", e);
        }

        // Not authorized -> Redirect to /admin/login
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.push("/admin/login");
      }
    }

    checkAdminAuth();
  }, [pathname, isLoginPage, router]);

  // Render Login page directly without sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading spinner while verifying security
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#016737] mb-3" />
        <p className="text-xs font-bold text-slate-600">Verifying Admin Security Permissions...</p>
      </div>
    );
  }

  // Block unauthorized rendering
  if (!isAuthorized) {
    return null;
  }

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("biovriksh_admin_token");
      localStorage.removeItem("biovriksh_admin_email");
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Chapters Manager", href: "/admin/chapters", icon: FolderTree },
    { name: "PDF Notes Manager", href: "/admin/pdfs", icon: FileText },
    { name: "Orders & Sales Log", href: "/admin/orders", icon: ShoppingCart },
    { name: "Student Directory", href: "/admin/students", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col md:flex-row select-none">
      {/* ═══ DESKTOP LIGHT SIDEBAR ═══ */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 shrink-0 justify-between shadow-xs">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center justify-center pb-4 border-b border-slate-100 mb-6">
            <img
              src="/logo_transparent.png"
              alt="Logo"
              className="h-16 w-auto object-contain drop-shadow-sm"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#016737] text-white shadow-md shadow-[#016737]/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors border border-slate-200"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#016737]" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200 cursor-pointer"
          >
            <span>Sign Out Admin</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE TOP HEADER ═══ */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center">
          <img
            src="/logo_transparent.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? "bg-[#016737] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2.5 text-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
            >
              Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 text-center rounded-xl bg-rose-100 text-xs font-bold text-rose-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Admin Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#016737] capitalize">
              {pathname === "/admin" ? "Dashboard Overview" : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#8BC43F]" />
              <span>Protected Master Admin</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
