import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { api } from "../api";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/categories", { name: formData.name });
      if (res.success) {
        setMessage("Category created successfully!");
        setTimeout(() => navigate("/categories"), 1500);
      } else {
        setMessage(res.error || "Failed to create category");
      }
    } catch (err) {
      setMessage(err.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Add Category</h1>
      <p className="mt-2 text-slate-600">
        Create a new category to organize your blog posts.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/categories"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
