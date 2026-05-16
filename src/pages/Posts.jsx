import { Link } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [page] = useState(1);
  const [perPage] = useState(10);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${page}&perPage=${perPage}`);
      if (res.success && res.data) {
        setPosts(res.data.posts || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  // Refresh from the database after every successful write so list state never drifts.
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await api.delete(`/posts/${id}`);
      if (res.success) {
        setMessage("Post deleted successfully!");
        loadPosts();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete post");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting post");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link
          to="/posts/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Post
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

      {posts.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Author</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{post.title}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      post.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{post.author?.name || "Unknown"}</td>
                  <td className="py-3 px-2 text-slate-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
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

export default Posts;
