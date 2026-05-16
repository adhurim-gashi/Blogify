import { useState, useEffect } from "react";
import { api } from "../api";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/newsletter/subscribers");
      if (res.success && res.data) {
        setSubscribers(res.data.subscribers || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const res = await api.delete(`/newsletter/subscribers/${id}`);
      if (res.success) {
        setMessage("Subscriber removed successfully!");
        loadSubscribers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to remove subscriber");
      }
    } catch (err) {
      setMessage(err.message || "Error removing subscriber");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Newsletter</h1>
      <p className="mt-2 text-slate-600">
        Manage newsletter subscribers and their subscription status.
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

      {subscribers.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Subscribed Date</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{sub.email}</td>
                  <td className="py-3 px-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-600">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <button
                      onClick={() => handleRemove(sub.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remove
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

export default Newsletter;