import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof LoginSchema>;

const inputBase =
  "block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAdminStore((s) => s.login);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect away if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@productly.com",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setCredError("");
    setIsSubmitting(true);
    // Tiny artificial delay for UX
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(data.email, data.password);
    setIsSubmitting(false);
    if (ok) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      setCredError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 animate-scale-in"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Logo + wordmark */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <svg
              className="h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1 L15 5 L15 11 L8 15 L1 11 L1 5 Z" />
            </svg>
          </div>
          <h1
            className="font-heading text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Productly
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Sign in to your admin account
          </p>
        </div>

        <hr className="mb-6" style={{ borderColor: "var(--border)" }} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail size={15} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${inputBase} field-input pl-10`}
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: errors.email
                    ? "var(--c-danger)"
                    : "var(--border)",
                  color: "var(--text-primary)",
                }}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: "var(--c-danger)" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputBase} field-input pr-10`}
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: errors.password
                    ? "var(--c-danger)"
                    : "var(--border)",
                  color: "var(--text-primary)",
                }}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center transition-opacity hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1 text-xs" style={{ color: "var(--c-danger)" }}>
                {errors.password.message}
              </p>
            ) : (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Use <span className="font-mono font-semibold">admin123</span> to
                sign in
              </p>
            )}
          </div>

          {/* Credential error */}
          {credError && (
            <p
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                color: "var(--c-danger)",
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {credError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-heading text-sm font-semibold text-white transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) => {
              if (!isSubmitting)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--accent)";
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          className="mt-8 text-center text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          Productly Admin v1.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
