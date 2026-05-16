import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

const EditTag = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/tags/${id}`)
      .then(res => {
        if (res.success && res.data.tag) {
          setFormData({ name: res.data.tag.name });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tag:", err);
        setMessage("Failed to load tag");
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
    if (!formData.name.trim()) newErrors.name = "Tag name is required";
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
      const res = await api.put(`/tags/${id}`, { name: formData.name });

      if (res.success) {
        setMessage("Tag updated successfully!");
        setTimeout(() => navigate("/tags"), 1500);
      } else {
        setMessage(res.error || "Failed to update tag");
      }
    } catch (err) {
      setMessage(err.message || "Error updating tag");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading tag...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit Tag</h1>
      <p className="mt-2 text-slate-600">Update this tag.</p>

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
              Tag Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter tag name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/tags"
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

export default EditTag;
