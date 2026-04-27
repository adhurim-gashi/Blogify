import { Link, Outlet } from "react-router";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blogify</h1>


                    <nav className="flex gap-6 text-sm font-medium">
                        <Link to="/home" className="text-slate-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 transition duration-300 pb-1">Home</Link>
                        <Link to="/blog" className="text-slate-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 transition duration-300 pb-1">Blog</Link>
                        <Link to="/about" className="text-slate-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 transition duration-300 pb-1">About</Link>
                        <Link to="/contact" className="text-slate-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 transition duration-300 pb-1">Contact</Link>
                        <Link to="/login" className="text-slate-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 transition duration-300 pb-1">
                        Login</Link>
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