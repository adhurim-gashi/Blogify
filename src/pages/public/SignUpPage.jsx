import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth-context";
import { getPostLoginPath } from "../../auth-roles";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setMessage("");
        const userData = await register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
        });
        navigate(getPostLoginPath(userData), { replace: true });
      } catch (err) {
        setMessage(err.message || "Sign up failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-xl bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            Join Blogify
          </p>
          <h2 className="mt-3 text-3xl font-bold">Create Your Account</h2>
          <p className="mt-3 text-slate-600">
            Sign up to join the platform and interact with blog content.
          </p>
        </div>

        {message && (
          <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.fullName && (
              <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 transition duration-300 hover:text-blue-600"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
