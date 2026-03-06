"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "../schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = async (values: RegisterData) => {
    setError("");
    setSuccessMessage("");

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Registration failed.");
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        onSuccess ? onSuccess() : router.push("/login");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
    bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserPlus className="h-7 w-7 text-rose-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Giftly
            </h1>
          </div>
          <p className="text-slate-600 text-sm">
            Create your account and start sharing joy 
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl
        shadow-xl border border-white/40 p-8">

          <form onSubmit={handleSubmit(submit)} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-sm text-emerald-800">{successMessage}</p>
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field === "firstName" ? "First name" : "Last name"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register(field as "firstName" | "lastName")}
                      className="w-full pl-10 py-2.5 rounded-lg border border-slate-300
                      focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition"
                    />
                  </div>
                  {errors[field as keyof RegisterData] && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors[field as keyof RegisterData]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Username */}
            <Input
              label="Username"
              icon={<User />}
              register={register("username")}
              error={errors.username?.message}
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              icon={<Mail />}
              register={register("email")}
              error={errors.email?.message}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              register={register("password")}
              error={errors.password?.message}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm password"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500
              hover:opacity-90 hover:scale-[1.01]
              focus:ring-4 focus:ring-rose-200
              transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-slate-600 pt-4 border-t">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-rose-600 hover:text-rose-500">
                Sign in
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 Giftly · Crafted with 
        </p>
      </div>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function Input({ label, icon, register, error, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          type={type}
          {...register}
          className="w-full pl-10 py-2.5 rounded-lg border border-slate-300
          focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition"
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function PasswordInput({ label, show, toggle, register, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          {...register}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300
          focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2
          text-slate-400 hover:text-rose-500 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
