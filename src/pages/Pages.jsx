import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pages?perPage=100");
      if (res.success && res.data) {
        setPages(res.data.pages || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await api.delete(`/pages/${id}`);
      if (res.success) {
        setMessage("Page deleted successfully!");
        loadPages();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete page");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting page");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading pages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Link
          to="/pages/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Page
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

      {pages.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No pages yet. Create your first page!</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Slug</th>
                <th className="py-3 px-2">Created</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{page.title}</td>
                  <td className="py-3 px-2 text-slate-600">{page.slug}</td>
                  <td className="py-3 px-2 text-slate-600">
                    {new Date(page.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <Link
                      to={`/pages/edit/${page.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(page.id)}
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

export default Pages;