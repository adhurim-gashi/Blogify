import { Link } from "react-router";
import { useState } from "react";
import { api } from "../../api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim() }, { needsAuth: false });
      setMessage(res.message || "If an account exists with this email, a reset link will be sent.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Unable to request a password reset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Account Recovery
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Forgot Password?
          </h2>

          <p className="mt-3 text-slate-600">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
            {message && (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="font-medium text-blue-500 transition duration-300 hover:text-blue-600"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
