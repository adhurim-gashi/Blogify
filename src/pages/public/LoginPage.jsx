import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth-context";

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
        await login(email, password);
        // Redirect to admin dashboard on successful login
        navigate("/");
      } catch (err) {
        setMessage(err.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="bg-white rounded-xl shadow p-8">
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
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 mb-3">
            Don't have an account? <Link to="/signup" className="text-blue-500 font-medium hover:text-blue-600">Sign up</Link>
          </p>
          <Link to="/home" className="text-blue-500 font-medium hover:text-blue-600 transition duration-300">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
