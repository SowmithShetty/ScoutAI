"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  User,
  Building2,
  Search,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, guestLogin, error, setError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: "scout" // default role for self-registration
        });
      }
      router.push("/dashboard");
    } catch (err) {
      // Error is stored in authContext and will be displayed
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await guestLogin();
      router.push("/dashboard");
    } catch (err) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── Left Side: Stadium Visual ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-electric/10 via-transparent to-emerald/10" />
        <div className="absolute inset-0 bg-grid" />

        {/* Spotlights */}
        <div className="spotlight-left" />
        <div className="spotlight-right" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric to-emerald flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">ScoutAI</h2>
                <p className="text-xs text-text-muted">Recruitment Intelligence</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
              The Future of
              <br />
              <span className="text-gradient">Football Scouting</span>
            </h1>

            <p className="text-text-secondary mb-8 max-w-md leading-relaxed">
              Join elite clubs using AI-powered analytics to make smarter
              recruitment decisions. Analyze 15,000+ players across 120+ leagues.
            </p>

            {/* Feature highlights */}
            <div className="space-y-3">
              {[
                "AI-powered player recommendations",
                "Advanced tactical fit analysis",
                "Comprehensive medical intelligence",
                "Real-time transfer market insights",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-emerald-bright" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent" />
      </div>

      {/* ─── Right Side: Login Form ─────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center min-h-screen px-6 py-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-dots opacity-30" />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-electric/5"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-emerald flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">ScoutAI</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            {isLogin
              ? "Sign in to access your recruitment dashboard"
              : "Join ScoutAI and start scouting smarter"}
          </p>

          {error && (
            <div className="bg-coral/20 border border-coral/30 text-coral p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="input-field pl-10"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-navy-light accent-electric"
                  />
                  Remember me
                </label>
                <a href="#" className="text-electric-bright hover:text-electric transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social / Role Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="btn-secondary justify-center py-2.5 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="btn-secondary justify-center py-2.5 text-sm">
              <Building2 className="w-4 h-4" />
              Club Login
            </button>
            <button className="btn-secondary justify-center py-2.5 text-sm">
              <Search className="w-4 h-4" />
              Scout Login
            </button>
            <button
              onClick={handleGuestLogin}
              className="btn-emerald justify-center py-2.5 text-sm"
            >
              <User className="w-4 h-4" />
              Guest Demo
            </button>
          </div>

          {/* Toggle Login/Register */}
          <p className="text-center text-sm text-text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-electric-bright hover:text-electric font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
