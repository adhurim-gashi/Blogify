import { Link, useNavigate } from "react-router";
import { Suspense, lazy, useState } from "react";
import { api } from "../api";

const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

const isHtmlEmpty = (html) => !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const CreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (isHtmlEmpty(formData.content)) newErrors.content = "Content is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/pages", formData);
      if (res.success) {
        setMessage("Page created successfully!");
        setTimeout(() => navigate("/pages"), 1500);
      } else {
        setMessage(res.error || "Failed to create page");
      }
    } catch (err) {
      setMessage(err.message || "Error creating page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Add Page</h1>
      <p className="mt-2 text-slate-600">
        Create a static page, such as About, Contact etc.
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
              Page Title *
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter page title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content *
            </label>
            <Suspense fallback={<div className="min-h-72 rounded-md border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Loading editor...</div>}>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => {
                  setFormData(prev => ({ ...prev, content }));
                  if (errors.content) setErrors(prev => ({ ...prev, content: "" }));
                }}
                placeholder="Write page content here..."
              />
            </Suspense>
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/pages"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
