import { Link, useNavigate, useParams } from "react-router";
import { Suspense, lazy, useState, useEffect } from "react";
import api from "../api";

const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

const isHtmlEmpty = (html) => !html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load post + categories
  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}`),
      api.get("/categories?perPage=100"),
      api.get("/tags?perPage=100")
    ])
      .then(([postRes, catRes, tagRes]) => {
        const post = postRes.data?.post || postRes.data;
        const cats = catRes.data?.categories || catRes.data || [];
        const loadedTags = tagRes.data?.tags || tagRes.data || [];

        if (post) {
          setFormData({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            ogImage: post.ogImage || "",
            content: post.content || "",
            status: post.status || "DRAFT",
            isScheduled: Boolean(post.isScheduled),
            scheduledAt: toDateTimeLocal(post.scheduledAt),
            categoryId: post.categoryId || post.categories?.[0]?.id || "",
            tagIds: post.tags?.map(tag => tag.id) || [],
          });
        }
        setCategories(cats);
        setTags(loadedTags);
        setLoading(false);
      })
      .catch(err => {
        setMessage(err.message || "Failed to load post. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, selectedOptions, type, checked } = e.target;
    const nextValue = name === "tagIds"
      ? Array.from(selectedOptions).map(option => option.value)
      : type === "checkbox"
        ? checked
      : value;
    setFormData(prev => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
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

    setSubmitting(true);
    setMessage("");

    try {
      const res = await api.put(`/posts/${id}`, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        ogImage: formData.ogImage || null,
        content: formData.content.trim(),
        status: formData.status,
        isScheduled: formData.isScheduled,
        scheduledAt: formData.isScheduled ? new Date(formData.scheduledAt).toISOString() : null,
        categories: formData.categoryId ? [formData.categoryId] : [],
        tags: formData.tagIds,
      });

      if (res.success) {
        setMessage("Post updated successfully!");
        setTimeout(() => navigate("/posts"), 1200);
      } else {
        setMessage(res.message || "Failed to update post");
      }
    } catch (err) {
      setMessage(err.message || "Error updating post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading post...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-slate-600">Update your blog post details</p>
        </div>
        <Link to="/posts" className="text-blue-600 hover:underline text-sm">
          &lt; Back to Posts
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 max-w-4xl">
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-awesome-post"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short summary of the post..."
            />
            {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700">SEO</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={70}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Open Graph Image URL</label>
                <input
                  type="text"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
                />
                {errors.scheduledAt && <p className="mt-1 text-sm text-red-500">{errors.scheduledAt}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <select
              name="tagIds"
              multiple
              value={formData.tagIds}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content *</label>
            <Suspense fallback={<div className="min-h-72 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Loading editor...</div>}>
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

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/posts"
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
