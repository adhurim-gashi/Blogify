import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import api from "../api";

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load existing page data
  useEffect(() => {
    const loadPage = async () => {
      try {
        const res = await api.get(`/pages/${id}`);
        const page = res.data?.page || res.data; // support both response shapes

        if (page) {
          setFormData({
            title: page.title || "",
            slug: page.slug || "",
            content: page.content || "",
          });
        }
      } catch (err) {
        console.error("Failed to load page:", err);
        setMessage("Failed to load page. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
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
      const res = await api.put(`/pages/${id}`, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
      });

      if (res.success) {
        setMessage("Page updated successfully!");
        setTimeout(() => {
          navigate("/pages");
        }, 1200);
      } else {
        setMessage(res.message || "Failed to update page");
      }
    } catch (err) {
      setMessage(err.message || "Error updating page. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading page...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Page</h1>
          <p className="text-slate-600 mt-1">Update page details and content</p>
        </div>
        <Link
          to="/pages"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Pages
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${
            message.includes("successfully")
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="About Us"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="about-us"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            <p className="text-xs text-slate-500 mt-1">Used in the URL (e.g. /about-us)</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Page Content *
            </label>
            <textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Write your page content here..."
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              to="/pages"
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
