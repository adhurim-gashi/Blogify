import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth-context";
import { canAccessAdmin } from "../auth-roles";

const baseLinkClass = "flex min-h-11 items-center border-b-2 px-1 text-sm font-medium transition duration-200";

const publicLinkClass = ({ isActive }) =>
  `${baseLinkClass} ${
    isActive
      ? "border-blue-500 text-blue-500"
      : "border-transparent text-slate-700 hover:border-blue-500 hover:text-blue-500"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex min-h-12 items-center rounded-md px-3 text-base font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
  }`;

const PublicLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const showDashboardLink = canAccessAdmin(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicLinks = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const accountLinks = user
    ? [
        { to: "/profile", label: "Profile" },
        ...(showDashboardLink ? [{ to: "/", label: "Dashboard" }] : []),
      ]
    : [
        { to: "/signup", label: "Sign Up" },
        { to: "/login", label: "Login" },
      ];

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  const renderLink = (link, mobile = false) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={() => mobile && setIsMenuOpen(false)}
      className={mobile ? mobileLinkClass : publicLinkClass}
    >
      {link.label}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/home" className="text-2xl font-bold">
            Blogify
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Public navigation">
            {publicLinks.map((link) => renderLink(link))}
            {accountLinks.map((link) => renderLink(link))}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className={`${baseLinkClass} border-transparent text-slate-700 hover:border-blue-500 hover:text-blue-500`}
              >
                Logout
              </button>
            )}
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="public-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
          >
            <span className="relative h-5 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {/* Mobile links explicitly close the panel so the next page is immediately usable after a tap. */}
        <div
          id="public-mobile-menu"
          className={`overflow-hidden border-t bg-white transition-all duration-300 md:hidden ${
            isMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile public navigation">
            {publicLinks.map((link) => renderLink(link, true))}
            <div className="my-2 border-t border-slate-100" />
            {accountLinks.map((link) => renderLink(link, true))}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 items-center rounded-md px-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div key={location.pathname} className="page-fade">
          <Outlet />
        </div>
      </main>

      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-slate-500">
          &copy; 2026 Blogify. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
