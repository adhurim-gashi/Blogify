import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { api } from "../api";

const UploadMedia = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.postForm("/media", formData);
      if (res.success) {
        setMessage("File uploaded successfully!");
        setTimeout(() => navigate("/media"), 1500);
      } else {
        setMessage(res.error || "Failed to upload file");
      }
    } catch (err) {
      setMessage(err.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Upload Media</h1>
      <p className="mt-2 text-slate-600">
        Upload new images or documents to your media library.
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
              Select File *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 bg-white"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {file && <p className="text-green-600 text-sm mt-1">Selected: {file.name}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/media"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMedia;