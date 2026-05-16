import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api, API_ORIGIN } from "../api";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get("/media?perPage=100");
      if (res.success && res.data) {
        setMedia(res.data.media || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await api.delete(`/media/${id}`);
      if (res.success) {
        setMessage("File deleted successfully!");
        loadMedia();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete file");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading media...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media</h1>
        <Link
          to="/media/upload"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Upload Media
        </Link>
      </div>
      <p className="mt-2 text-slate-600">
        Manage uploaded images and media files.
      </p>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes("successfully")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}

      {media.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No files yet. Upload your first file!</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">File Name</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Size</th>
                <th className="py-3 px-2">Uploaded</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {media.map(file => (
                <tr key={file.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{file.filename}</td>
                  <td className="py-3 px-2 text-slate-600">{file.mimetype}</td>
                  <td className="py-3 px-2 text-slate-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </td>
                  <td className="py-3 px-2 text-slate-600">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <a
                      href={`${API_ORIGIN}${file.filepath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
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

export default Media;
