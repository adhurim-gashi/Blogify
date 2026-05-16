import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tags?perPage=100");
      if (res.success && res.data) {
        setTags(res.data.tags || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await api.delete(`/tags/${id}`);
      if (res.success) {
        setMessage("Tag deleted successfully!");
        loadTags();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete tag");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting tag");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading tags...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Link
          to="/tags/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Tag
        </Link>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes("successfully")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}

      {tags.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No tags yet. Create your first tag!</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Slug</th>
                <th className="py-3 px-2">Posts</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{tag.name}</td>
                  <td className="py-3 px-2 text-slate-600">{tag.slug}</td>
                  <td className="py-3 px-2">{tag._count?.posts || 0}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <Link
                      to={`/tags/edit/${tag.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tags;
