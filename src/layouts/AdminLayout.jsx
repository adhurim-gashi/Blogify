import { Outlet } from "react-router";
import { NavLink } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <aside className="hidden md:block w-64 bg-slate-900 text-white p-4">
        
        <nav className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Admin Dashboard</p>
          <h1 className="mb-10 font-bold text-2xl">Blogify</h1>
          
          <ul className="space-y-3">
          <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Dashboard
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Posts
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Categories
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/tags"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Tags
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/comments"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Comments
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/pages"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Pages
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/media"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Media
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/newsletter"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Newsletter
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Settings
          </NavLink>
          </li>
          <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800"
              }`
            }
          >
            Users
          </NavLink>
          </li>






          </ul>
        </nav>
      </aside>

      <main className="flex-1 bg-slate-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}


export default AdminLayout;