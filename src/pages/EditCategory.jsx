import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/categories/${id}`)
      .then(res => {
        if (res.success && res.data.category) {
          setFormData({ name: res.data.category.name });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load category:", err);
        setMessage("Failed to load category");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await api.put(`/categories/${id}`, { name: formData.name });

      if (res.success) {
        setMessage("Category updated successfully!");
        setTimeout(() => navigate("/categories"), 1500);
      } else {
        setMessage(res.error || "Failed to update category");
      }
    } catch (err) {
      setMessage(err.message || "Error updating category");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading category...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit Category</h1>
      <p className="mt-2 text-slate-600">Update this category.</p>

      <div className="bg-white rounded-xl shadow p-6 mt-6 max-w-md">
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
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
