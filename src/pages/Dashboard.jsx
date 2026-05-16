import { useState, useEffect } from "react";
import api from "../api"; // adjust if your api.js uses named export

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/dashboard/stats");
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.message || "Failed to load dashboard stats");
      }
    } catch (err) {
      setError(err.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Welcome back, here is an overview of your blog
          </p>
        </div>
        <button
          onClick={loadStats}
          className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-sm text-slate-500">Total Posts</p>
          <h2 className="text-3xl font-bold mt-1">{stats?.totalPosts || 0}</h2>
          <p className="text-xs text-green-600 mt-1">Published</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-sm text-slate-500">Comments</p>
          <h2 className="text-3xl font-bold mt-1">{stats?.totalComments || 0}</h2>
          <p className="text-xs text-yellow-600 mt-1">Total</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-sm text-slate-500">Users</p>
          <h2 className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</h2>
          <p className="text-xs text-blue-600 mt-1">Registered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-sm text-slate-500">Newsletter</p>
          <h2 className="text-3xl font-bold mt-1">{stats?.totalSubscribers || 0}</h2>
          <p className="text-xs text-emerald-600 mt-1">Subscribers</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-1">Categories</h2>
          <p className="text-4xl font-bold text-blue-600">{stats?.totalCategories || 0}</p>
          <p className="text-sm text-slate-600 mt-1">Total categories</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-1">Tags</h2>
          <p className="text-4xl font-bold text-purple-600">{stats?.totalTags || 0}</p>
          <p className="text-sm text-slate-600 mt-1">Total tags</p>
        </div>
      </div>

      {/* Optional: Latest activity section can be added here later */}
    </div>
  );
};

export default Dashboard;