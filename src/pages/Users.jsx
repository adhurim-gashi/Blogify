import { useState, useEffect } from "react";
import { api } from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "", bio: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users?perPage=100");
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      setMessage(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this user account?")) return;

    try {
      const res = await api.post(`/users/${id}/disable`);
      if (res.success) {
        setMessage("User disabled successfully!");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to disable user");
      }
    } catch (err) {
      setMessage(err.message || "Error disabling user");
    }
  };

  const handleActivate = async (id) => {
    if (!window.confirm("Activate this user account?")) return;

    try {
      const res = await api.post(`/users/${id}/activate`);
      if (res.success) {
        setMessage("User activated successfully!");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.error || "Failed to activate user");
      }
    } catch (err) {
      setMessage(err.message || "Error activating user");
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      bio: user.bio || "",
    });
    setMessage("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    setMessage("");
    try {
      const res = await api.put(`/users/${editingUser.id}`, editForm);
      if (res.success) {
        setMessage("User updated successfully!");
        setEditingUser(null);
        await loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.message || res.error || "Failed to update user");
      }
    } catch (err) {
      setMessage(err.message || "Error updating user");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="mt-2 text-slate-600">
        Manage registered users and their roles.
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

      {editingUser && (
        <form onSubmit={handleUpdate} className="mt-6 bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              name="username"
              value={editForm.username}
              onChange={handleEditChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
            <input
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save User"}
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="border border-slate-300 px-4 py-2 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {users.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl shadow text-center">
          <p className="text-slate-500">No users yet.</p>
        </div>
      ) : (
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{user.name || user.username}</td>
                  <td className="py-3 px-2 text-slate-600">{user.email}</td>
                  <td className="py-3 px-2">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {user.role?.name || "Reader"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.disabled
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {user.disabled ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    {user.disabled ? (
                      <button
                        onClick={() => handleActivate(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDisable(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Disable
                      </button>
                    )}
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

export default Users;
