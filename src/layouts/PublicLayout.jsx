import { NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth-context";


const PublicLayout = () => {
const location = useLocation();
const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                 
                <NavLink to="/home" className="flex shrink-0 items-center gap-1">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold text-white shadow-sm">
                        B
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                        log<span className="text-blue-500">ify</span>
                    </span>
                </NavLink>


                    <nav className="flex gap-6 text-sm font-medium"
                    >
                       <NavLink
                       to="/home"
                       className={({isActive}) =>
                        `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                            isActive
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent hover:border-blue-500 hover:text-blue-500"
                        }`
                        }>
                        Home
                       </NavLink>
                       <NavLink
                       to="/about"
                       className={({isActive}) =>
                        `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                            isActive
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent hover:border-blue-500 hover:text-blue-500"
                        }`
                        }>
                        About
                       </NavLink>
                       <NavLink
                       to="/blog"
                       className={({isActive}) =>
                        `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                            isActive
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent hover:border-blue-500 hover:text-blue-500"
                        }`
                        }>
                        Blog
                       </NavLink>
                       <NavLink
                       to="/contact"
                       className={({isActive}) =>
                        `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                            isActive
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent hover:border-blue-500 hover:text-blue-500"
                        }`
                        }>
                        Contact
                       </NavLink>
                       {user ? (
                        <>
                         <NavLink
                         to="/profile"
                         className={({isActive}) =>
                          `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                              isActive
                              ? "border-blue-500 text-blue-500"
                              : "border-transparent hover:border-blue-500 hover:text-blue-500"
                          }`
                          }>
                          Profile
                         </NavLink>
                         <NavLink
                         to="/"
                         className="text-slate-700 border-b-2 border-transparent pb-1 transition duration-300 hover:border-blue-500 hover:text-blue-500">
                          Dashboard
                         </NavLink>
                         <button
                         type="button"
                         onClick={logout}
                         className="text-slate-700 border-b-2 border-transparent pb-1 transition duration-300 hover:border-blue-500 hover:text-blue-500">
                          Logout
                         </button>
                        </>
                       ) : (
                        <>
                         <NavLink
                         to="/signup"
                         className={({isActive}) =>
                          `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                              isActive
                              ? "border-blue-500 text-blue-500"
                              : "border-transparent hover:border-blue-500 hover:text-blue-500"
                          }`
                          }>
                          Sign Up
                         </NavLink>
                         <NavLink
                         to="/login"
                         className={({isActive}) =>
                          `text-slate-700 border-b-2 pb-1 transition duration-300 ${
                              isActive
                              ? "border-blue-500 text-blue-500"
                              : "border-transparent hover:border-blue-500 hover:text-blue-500"
                          }`
                          }>
                          Login
                         </NavLink>
                        </>
                       )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <div key={location.pathname} className="page-fade">
                <Outlet />
                </div>
            </main>

            <footer className="border-t bg-white mt-16">
                <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500 text-center">
                © 2026 Blogify. All rights reserved.
                </div>
            </footer>
        </div>
    )
}


export default PublicLayout;




