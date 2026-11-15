import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHero from "../components/auth/AuthHero";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import { requestPasswordReset } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not request a password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout hero={<AuthHero />}>
      <AuthCard>
        <AuthHeader
          title="Forgot Password?"
          subtitle="Enter your email and we'll send you a password reset link."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700" role="status">{message}</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            icon={Mail}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30"
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
