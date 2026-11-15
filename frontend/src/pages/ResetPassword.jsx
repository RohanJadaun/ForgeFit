import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHero from "../components/auth/AuthHero";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import PasswordInput from "../components/auth/PasswordInput";
import PasswordStrength from "../components/auth/PasswordStrength";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    const token = searchParams.get("token");
    if (!token) {
      setError("This reset link is incomplete. Request a new password reset link.");
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(token, form.password);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not reset your password. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout hero={<AuthHero />}>
      <AuthCard>
        <AuthHeader
          title="Reset Password"
          subtitle="Create a new secure password."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700" role="status">{message} <Link to="/login" className="font-semibold underline">Log in</Link></p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
          <PasswordInput
            label="New Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New password"
            icon={Lock}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />

          <PasswordStrength password={form.password} />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            icon={Lock}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={loading || Boolean(message)}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPassword;
