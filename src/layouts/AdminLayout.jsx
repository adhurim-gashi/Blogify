import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router";
import { useAuth } from "../auth-context";
import { canAccessAdmin } from "../auth-roles";

const adminLinks = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/posts", label: "Posts" },
  { to: "/categories", label: "Categories" },
  { to: "/tags", label: "Tags" },
  { to: "/comments", label: "Comments" },
  { to: "/pages", label: "Pages" },
  { to: "/media", label: "Media" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/settings", label: "Settings" },
  { to: "/users", label: "Users" },
  { to: "/audit-logs", label: "Audit Logs" },
];

const adminLinkClass = ({ isActive }) =>
  `flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const AdminNav = ({ user, onLogout, onNavigate }) => (
  <div className="flex h-full flex-col bg-slate-900 p-4 text-white">
    <nav className="mt-2 flex-1 overflow-y-auto" aria-label="Admin navigation">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Admin Dashboard</p>
      <NavLink to="/" onClick={onNavigate} className="mb-8 block text-2xl font-bold">
        Blogify
      </NavLink>

      <ul className="space-y-2">
        {adminLinks.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.end} onClick={onNavigate} className={adminLinkClass}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-300">
      <p className="truncate">{user.name || user.username || user.email}</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-3 flex min-h-11 w-full items-center rounded-md bg-slate-800 px-3 py-2 text-left text-white transition hover:bg-slate-700"
      >
        Logout
      </button>
    </div>
  </div>
);

const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessAdmin(user)) {
    // Readers are public-site accounts only; redirect them before any admin UI renders.
    return <Navigate to="/home" replace state={{ accessDenied: true }} />;
  }

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="hidden h-screen w-64 shrink-0 md:sticky md:top-0 md:block">
        <AdminNav user={user} onLogout={handleLogout} />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close admin navigation" : "Open admin navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="admin-mobile-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="relative h-5 w-5" aria-hidden="true">
                <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-4 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
            <NavLink to="/" className="min-w-0 truncate text-xl font-bold text-slate-950">
              Blogify
            </NavLink>
            <span className="max-w-[8rem] truncate text-right text-xs font-medium text-slate-500">
              {user.role?.name || user.role || "Admin"}
            </span>
          </div>
        </header>

        <div
          className={`fixed inset-0 z-50 md:hidden ${
            isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <button
            type="button"
            aria-label="Close admin navigation overlay"
            onClick={() => setIsMenuOpen(false)}
            className={`absolute inset-0 bg-slate-950/50 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            id="admin-mobile-menu"
            className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] transform transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <AdminNav user={user} onLogout={handleLogout} onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>

        <main className="min-w-0 flex-1 overflow-x-auto p-4 sm:p-6 [&_table]:min-w-[640px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
