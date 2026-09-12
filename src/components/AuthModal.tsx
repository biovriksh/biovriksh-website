"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Sparkles, LogIn, UserPlus, Loader2, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: "signin" | "signup";
  customTitle?: string;
  customSubtitle?: string;
}

function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "signin",
  customTitle,
  customSubtitle,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const supabase = createClient();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setErrorMsg(
        err.message?.includes("provider is not enabled") || err.message?.includes("OAuth")
          ? "Google Sign-In is not enabled yet in your Supabase Auth settings. Please enable Google Provider in Supabase Dashboard -> Authentication -> Providers."
          : err.message || "Google Sign-In failed. Please try Email & Password login."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/profile` : undefined,
      });

      if (error) throw error;

      setSuccessMsg(
        "Password reset link has been sent to your email! Please check your inbox & spam folder."
      );
    } catch (err: any) {
      console.error("Reset password error:", err);
      setErrorMsg(err.message || "Unable to send password reset email. Please verify your email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    try {
      if (mode === "signup") {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your full name");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (error) throw error;

        // Check if user already exists
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setErrorMsg("This email is already registered. Attempting to log you in...");
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (signInError) {
            if (signInError.message.includes("Email not confirmed")) {
              throw new Error("Email confirmation is required by Supabase settings. Please check your inbox or turn off 'Confirm Email' in Supabase Dashboard.");
            }
            throw new Error("Account already exists with this email. Please enter your correct password to log in, or click 'Forgot Password'.");
          }

          setSuccessMsg("Welcome back! Logged in successfully.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1000);
          return;
        }

        // Auto sign in if session is not active yet
        let activeSession = data.session;
        if (!activeSession) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });
          if (!signInError && signInData.session) {
            activeSession = signInData.session;
          }
        }

        if (activeSession) {
          setSuccessMsg("Account created successfully! You are now logged in.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1200);
        } else {
          setSuccessMsg("Account created! Please check your email inbox to verify if email confirmation is required, or click Log In.");
          setTimeout(() => {
            setMode("signin");
          }, 2500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Email not confirmed! Please check your inbox to verify your email, or turn off 'Confirm Email' in Supabase Auth settings.");
          }
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Incorrect Email or Password! Please verify your login details, or click 'Forgot Password?' to reset your password.");
          }
          throw error;
        }

        setSuccessMsg("Welcome back! Login successful.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style>{`
            .auth-input {
              color: #111827 !important;
              background-color: #ffffff !important;
            }
            .auth-input:-webkit-autofill,
            .auth-input:-webkit-autofill:hover, 
            .auth-input:-webkit-autofill:focus,
            .auth-input:-webkit-autofill:active {
              -webkit-text-fill-color: #111827 !important;
              -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
              box-shadow: 0 0 0px 1000px #ffffff inset !important;
              transition: background-color 5000s ease-in-out 0s;
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 z-10"
          >
            {/* Top Decorative Header with High-Contrast Text */}
            <div className="bg-[#014d29] p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-[#8BC43F]" />
                </div>
                <span
                  className="text-xs font-black uppercase tracking-wider text-white"
                  style={{ color: "#ffffff" }}
                >
                  Bio Vriksh Account
                </span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-black text-white leading-tight"
                style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
              >
                {customTitle ||
                  (mode === "forgot"
                    ? "Reset Your Password"
                    : mode === "signin"
                    ? "Welcome back future doctors"
                    : "Create Student Account")}
              </h3>
              <p
                className="text-xs sm:text-sm text-gray-200 mt-1 font-semibold leading-relaxed"
                style={{ color: "#f1f5f9" }}
              >
                {customSubtitle ||
                  (mode === "forgot"
                    ? "Enter your email to receive a password reset link"
                    : mode === "signin"
                    ? "Log in to access your notes, active plans & profile"
                    : "Join thousands of NEET aspirants preparing with Bio Vriksh")}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {mode !== "forgot" && (
              <div className="flex border-b border-gray-200 bg-gray-50/80">
                <button
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-3.5 text-xs font-black transition-all flex items-center justify-center gap-2 border-b-2 ${
                    mode === "signin"
                      ? "border-[#016737] text-[#016737] bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-3.5 text-xs font-black transition-all flex items-center justify-center gap-2 border-b-2 ${
                    mode === "signup"
                      ? "border-[#016737] text-[#016737] bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}

            {/* Form */}
            <div className="p-6 space-y-4 bg-white">
              {/* Google Sign-In Quick Action */}
              {mode !== "forgot" && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <GoogleLogo className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 w-full" />
                    <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                      or with Email
                    </span>
                    <div className="border-t border-gray-200 w-full" />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center">
                  {successMsg}
                </div>
              )}

              {/* FORGOT PASSWORD FORM */}
              {mode === "forgot" ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-900 mb-1">Your Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                        className="auth-input w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#016737] focus:ring-2 focus:ring-[#016737]/20 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#016737]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="inline-flex items-center gap-1 text-xs text-gray-700 font-bold hover:text-[#016737] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Log In</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* LOGIN & SIGNUP FORMS */
                <form onSubmit={handleAuth} className="space-y-4">
                  {mode === "signup" && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            required
                            placeholder="Dr. Rahul Sharma"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ color: "#111827", backgroundColor: "#ffffff" }}
                            className="auth-input w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#016737] focus:ring-2 focus:ring-[#016737]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-1">Phone Number (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ color: "#111827", backgroundColor: "#ffffff" }}
                            className="auth-input w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#016737] focus:ring-2 focus:ring-[#016737]/20 transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-900 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                        className="auth-input w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#016737] focus:ring-2 focus:ring-[#016737]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-gray-900">Password</label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot");
                            setErrorMsg("");
                            setSuccessMsg("");
                          }}
                          className="text-[11px] font-bold text-[#016737] hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                        className="auth-input w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#016737] focus:ring-2 focus:ring-[#016737]/20 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#016737]/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <span>{mode === "signin" ? "Sign In to Account" : "Create My Free Account"}</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === "signin" ? "signup" : "signin");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-xs text-gray-700 font-bold hover:text-[#016737] transition-colors cursor-pointer"
                    >
                      {mode === "signin"
                        ? "Don't have an account? Sign up now"
                        : "Already registered? Log in here"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
