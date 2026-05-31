import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth-context";
import { getPostLoginPath } from "../../auth-roles";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setMessage("");
        const userData = await login(email, password);
        navigate(getPostLoginPath(userData), { replace: true });
      } catch (err) {
        setMessage(err.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-xl bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Welcome Back
          </p>
          <h2 className="mt-3 text-3xl font-bold">Login to Blogify</h2>
          <p className="mb-5">
            Log in to manage your profile, comment on posts, and access your Blogify account.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password}</p>
            )}

            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-500 transition duration-300 hover:text-blue-600"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="mb-3 text-slate-600">
            Don't have an account? <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-600">Sign up</Link>
          </p>
          <Link to="/home" className="font-medium text-blue-500 transition duration-300 hover:text-blue-600">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
