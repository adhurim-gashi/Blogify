import { useState, useEffect } from "react";
import { api } from "../api";

const Settings = () => {
  const [settingRecords, setSettingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings?perPage=100");
      if (res.success && res.data) {
        const settingsArray = res.data.settings || [];
        setSettingRecords(settingsArray);

        const settingsMap = {};
        settingsArray.forEach(s => {
          settingsMap[s.key] = s.value;
        });

        setFormData({
          siteName: settingsMap.siteName || "",
          siteDescription: settingsMap.siteDescription || "",
        });
      }
    } catch (err) {
      setMessage(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      // Find existing setting records by key
      const siteNameRecord = settingRecords.find(s => s.key === "siteName");
      const siteDescRecord = settingRecords.find(s => s.key === "siteDescription");

      // Update or create siteName
      if (siteNameRecord) {
        await api.put(`/settings/${siteNameRecord.id}`, { key: "siteName", value: formData.siteName });
      } else {
        await api.post("/settings", { key: "siteName", value: formData.siteName });
      }

      // Update or create siteDescription
      if (siteDescRecord) {
        await api.put(`/settings/${siteDescRecord.id}`, { key: "siteDescription", value: formData.siteDescription });
      } else {
        await api.post("/settings", { key: "siteDescription", value: formData.siteDescription });
      }

      setMessage("Settings saved successfully!");
      // Reload settings to get latest state
      await loadSettings();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Error saving settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-slate-600">
        Manage general website settings and configuration.
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
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              placeholder="Enter site name"
              value={formData.siteName}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              rows="4"
              placeholder="Enter site description"
              value={formData.siteDescription}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
