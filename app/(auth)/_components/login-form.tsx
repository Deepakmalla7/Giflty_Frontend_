"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";

interface LoginFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onSuccess?: () => void;
}

export function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setServerError("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
        credentials: 'include'
      });

      const result = await response.json();

      if (!result?.success) {
        setServerError(result?.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      onSubmit?.({ email, password, rememberMe });
      
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4 shadow-lg shadow-violet-500/25">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400">Sign in to continue to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/30 animate-shake">
                <p className="text-sm text-red-400 font-medium">{serverError}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-white/10 rounded-xl text-sm text-white placeholder-slate-500 bg-white/5 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={3}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-white/10 rounded-xl text-sm text-white placeholder-slate-500 bg-white/5 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-2 focus:ring-violet-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-slate-400 group-hover:text-slate-200 transition">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-slate-500 font-medium" style={{ backdropFilter: "blur(4px)" }}>Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full py-3 px-4 border-2 border-white/10 rounded-xl font-medium text-slate-300 hover:bg-white/5 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}