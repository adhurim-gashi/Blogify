import { NavLink, Outlet } from "react-router";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blogify</h1>


                    <nav className="flex gap-6 text-sm font-medium">
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
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
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




