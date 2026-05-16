import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories?perPage=100");
      if (res.success && res.data) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.success) {
        setMessage("Category deleted successfully!");
        loadCategories();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete category");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          to="/categories/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Category
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

      {categories.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No categories yet. Create your first category!</p>
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
              {categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{cat.name}</td>
                  <td className="py-3 px-2 text-slate-600">{cat.slug}</td>
                  <td className="py-3 px-2">{cat._count?.posts || 0}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <Link
                      to={`/categories/edit/${cat.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cat.id)}
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

export default Categories;