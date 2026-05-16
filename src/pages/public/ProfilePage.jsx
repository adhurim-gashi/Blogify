import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { api } from "../../api";
import { useAuth } from "../../auth-context";

const ProfilePage = () => {
    const { user, isLoading, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        bio: "",
    });
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                username: user.username || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-16 text-slate-600">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            const res = await api.put(`/users/${user.id}`, formData);
            if (res.success) {
                await refreshUser();
                setMessage("Profile updated successfully!");
            } else {
                setMessage(res.message || res.error || "Failed to update profile");
            }
        } catch (err) {
            setMessage(err.message || "Error updating profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-16">
            <section className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                    My Profile
                </p>
                <h2 className="mt-4 text-4xl font-bold">
                    Manage your account information
                </h2>

                <p className="mt-6 text-lg text-slate-600">
                    View and update your personal details, account role, and profile information.
                </p>
            </section>

            <div className="bg-white rounded-xl shadow p-6 mt-10">
                {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${
                        message.includes("successfully")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                            {formData.name?.[0] || formData.username?.[0] || "U"}
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Username
                                </label>

                                <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Role
                                </label>

                                <input
                                type="text"
                                value={user.role?.name || user.role || "Reader"}
                                className="w-full border border-slate-300 rounded-md px-4 py-2 bg-slate-100 text-slate-500"
                                readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                rows="5"
                                name="bio"
                                placeholder="Write a short bio..."
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                        <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
