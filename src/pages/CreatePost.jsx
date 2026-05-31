import { Link, useNavigate } from "react-router";
import { Suspense, lazy, useState, useEffect } from "react";
import { api } from "../api";

const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

const isHtmlEmpty = (html) => !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    content: "",
    status: "DRAFT",
    isScheduled: false,
    scheduledAt: "",
    categoryId: "",
    tagIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormLoading(true);
    Promise.all([
      api.get("/categories?perPage=100"),
      api.get("/tags?perPage=100")
    ])
      .then(([categoryRes, tagRes]) => {
        if (categoryRes.success && categoryRes.data.categories) {
          setCategories(categoryRes.data.categories);
        }
        if (tagRes.success && tagRes.data.tags) {
          setTags(tagRes.data.tags);
        }
      })
      .catch(err => setMessage(err.message || "Failed to load categories and tags."))
      .finally(() => setFormLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, selectedOptions, type, checked } = e.target;
    const nextValue = name === "tagIds"
      ? Array.from(selectedOptions).map(option => option.value)
      : type === "checkbox"
        ? checked
      : value;
    setFormData(prev => ({ ...prev, [name]: nextValue }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (isHtmlEmpty(formData.content)) newErrors.content = "Content is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (formData.isScheduled && !formData.scheduledAt) newErrors.scheduledAt = "Schedule date is required";
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
      const res = await api.post("/posts", {
        title: formData.title,
        excerpt: formData.excerpt,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        ogImage: formData.ogImage || undefined,
        content: formData.content,
        status: formData.status,
        isScheduled: formData.isScheduled,
        scheduledAt: formData.isScheduled ? new Date(formData.scheduledAt).toISOString() : undefined,
        categories: formData.categoryId ? [formData.categoryId] : [],
        tags: formData.tagIds,
      });

      if (res.success) {
        setMessage("Post created successfully!");
        setTimeout(() => navigate("/posts"), 1500);
      } else {
        setMessage(res.error || "Failed to create post");
      }
    } catch (err) {
      setMessage(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create New Post</h1>
      <p className="mt-2 text-slate-600">
        Fill in the details below to publish a new blog post.
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
              Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              placeholder="Brief summary of the post"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={formLoading}
                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{formLoading ? "Loading categories..." : "Select a category"}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700">SEO</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={70}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Open Graph Image URL</label>
                <input
                  type="text"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows="2"
                className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="isScheduled"
                checked={formData.isScheduled}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Schedule this post for future publishing
            </label>
            {formData.isScheduled && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
                />
                {errors.scheduledAt && <p className="mt-1 text-sm text-red-500">{errors.scheduledAt}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <select
              name="tagIds"
              multiple
              value={formData.tagIds}
              onChange={handleChange}
              disabled={formLoading}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
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
                placeholder="Write your post content here..."
              />
            </Suspense>
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/posts"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
