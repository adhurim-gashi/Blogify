import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../../api";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState(token ? "Verifying your email..." : "");
  const [error, setError] = useState(token ? "" : "Verification token is missing.");

  useEffect(() => {
    if (!token) return;
    let isActive = true;

    api.post("/auth/verify-email", { token }, { needsAuth: false })
      .then((res) => {
        if (!isActive) return;
        setMessage(res.message || "Email verified successfully.");
        setError("");
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err.message || "Unable to verify email.");
        setMessage("");
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Account Verification
        </p>
        <h2 className="mt-3 text-3xl font-bold">Verify Email</h2>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <Link to="/login" className="mt-6 inline-block font-medium text-blue-500 hover:text-blue-600">
          Continue to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
