import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action: "", targetType: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setMessage("");
    const params = new URLSearchParams({ perPage: "100" });
    if (filters.action) params.set("action", filters.action);
    if (filters.targetType) params.set("targetType", filters.targetType);

    try {
      const res = await api.get(`/audit-logs?${params.toString()}`);
      setLogs(res.data?.logs || []);
    } catch (err) {
      setMessage(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [filters.action, filters.targetType]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Audit Logs</h1>
      <p className="mt-2 text-slate-600">Review important administrative and moderation events.</p>

      <div className="mt-6 rounded-xl bg-white p-4 shadow">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            name="action"
            value={filters.action}
            onChange={handleChange}
            placeholder="Filter by action"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="targetType"
            value={filters.targetType}
            onChange={handleChange}
            placeholder="Filter by target type"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={loadLogs}
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Apply
          </button>
        </div>

        {message && <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{message}</div>}

        {loading ? (
          <p className="mt-6 text-slate-500">Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <p className="mt-6 text-slate-500">No audit logs found.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-3">Time</th>
                  <th className="px-2 py-3">Action</th>
                  <th className="px-2 py-3">Actor</th>
                  <th className="px-2 py-3">Target</th>
                  <th className="px-2 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b align-top hover:bg-slate-50">
                    <td className="px-2 py-3 text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-2 py-3 font-medium">{log.action}</td>
                    <td className="px-2 py-3">{log.performedBy?.email || "System"}</td>
                    <td className="px-2 py-3">{log.targetType}: {log.targetId}</td>
                    <td className="px-2 py-3 font-mono text-xs text-slate-600">{log.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
