import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [page] = useState(1);
  const [perPage] = useState(10);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      // Load all comments using the efficient admin endpoint (includes post info)
      const res = await api.get(`/comments/admin/all?page=${page}&perPage=${perPage}`);
      if (res.success && res.data) {
        setComments(res.data.comments || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleApprove = async (id) => {
    try {
      const res = await api.post(`/comments/${id}/approve`);
      if (res.success) {
        setMessage("Comment approved!");
        loadComments();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to approve comment");
      }
    } catch (err) {
      setMessage(err.message || "Error approving comment");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.post(`/comments/${id}/reject`);
      if (res.success) {
        setMessage("Comment rejected!");
        loadComments();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to reject comment");
      }
    } catch (err) {
      setMessage(err.message || "Error rejecting comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await api.delete(`/comments/${id}`);
      if (res.success) {
        setMessage("Comment deleted!");
        loadComments();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to delete comment");
      }
    } catch (err) {
      setMessage(err.message || "Error deleting comment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Comments</h1>
      <p className="mt-2 text-slate-600">
        Review and moderate reader comments.
      </p>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes("Error") || message.includes("Failed")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {comments.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No comments yet.</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">User</th>
                <th className="py-3 px-2">Post</th>
                <th className="py-3 px-2">Comment</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{comment.author?.name || "Anonymous"}</td>
                  <td className="py-3 px-2 text-slate-600">{comment.post?.title || "Unknown"}</td>
                  <td className="py-3 px-2 truncate max-w-xs">{comment.content}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      comment.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-slate-500 text-white px-2 py-1 rounded text-xs hover:bg-slate-600"
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

export default Comments;
  
