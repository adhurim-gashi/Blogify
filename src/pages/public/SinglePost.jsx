import { Link } from "react-router";

const SinglePost = () => {

    
return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
             <h1 className="text-2xl font-bold">Blogify</h1>
            

            <nav className="flex gap-6 text-sm font-medium">
                <Link to="/home" className="hover:text-blue-500">Home</Link>
                <Link to="/blog" className="hover:text-blue-500">Blog</Link>
                <Link to="/about" className="hover:text-blue-500">About</Link>
                <Link to="/contact" className="hover:text-blue-500">Contact</Link>
            </nav>
            </div>
        </header>


        <main className="mx-auto max-w-3xl px-6 py-12">
            <Link 
            to="/blog"
            className="inline-block mb-8 text-blue-500 font-medium"
            >
                Back to Blog
            </Link>


            <article className="bg-white rounded-xl shadow p-8">
                <p className="text-sm text-blue-500 font-medium">Productivity</p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                    10 Habits That Help You Stay Focused
                </h1>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>By Adhurim Gashi</span>
                    <span>2026-04-23</span>
                    <span>5 min read</span>
                </div>

                <p className="mt-8 text-lg text-slate-700 leading-8">
                    Staying focused has become one of the biggest challenges in modern life. With notifications, busy schedules, and constant information, it is easy to lose track of what really matters.
                </p>

                <p className="mt-6 text-slate-700 leading-8">
                    Building better habits can help you create structure and reduce distractions. Simple routines like planning your day, setting clear priorities, and taking short breaks can make your work feel more manageable.
                </p>

                <p className="mt-6 text-slate-700 leading-8">
                    Focus does not come from doing everything at once. It comes from choosing what deserves your attention and giving yourself the right environment to complete it.
                </p>
            </article>
        </main>
    </div>
)
}


export default SinglePost;