import { Link } from "react-router";

const BlogPage = () =>  {
return (
        <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                    Blog Articles
                </p>
                <h2 className="mt-4 text-4xl font-bold">Latest Posts</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Explore articles, tutorials, and insights from the Blogify platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <article className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-blue-500 font-medium">Productivity</p>
                    <h3 className="mt-3 text-xl font-semibold">
                        10 Habits That Help You Stay Focused
                    </h3>

                    <p className="mt-3 text-slate-600">
                        Simple routines and planning methods that help you stay organized
                        and make better use of your day. 
                    </p>

                    <Link
                    to="/blog/10-habits-that-help-you-stay-focused"
                    className="inline-block mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Read More
                    </Link>
                </article>

                <article className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-blue-500 font-medium">Design</p>
                    <h3 className="mt-3 text-xl font-semibold">Why Clean Design Improves User Experience</h3>

                    <p className="mt-3 text-slate-600">
                        A look at spacing, typography, and visual hierarchy, and how they make websites easier and more enjoyable to use.
                    </p>

                    <Link 
                    to="/blog/why-clean-design-improves-user-experience"
                    className="inline-block mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Read More
                    </Link>
                </article>


                <article className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-blue-500 font-medium">Technology</p>
                    <h3 className="mt-3 text-xl font-semibold">
                        The Role of AI Tools in Everyday Work
                    </h3>

                    <p className="mt-3 text-slate-600">
                        AI tools are becoming part of daily workflows, helping people write, research, plan, and solve problems faster.
                    </p>

                    <Link 
                    to="/blog/the-role-of-ai-tools-in-everyday-work"
                    className="inline-block mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Read More
                    </Link>
                </article>

                <article className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-blue-500 font-medium">Marketing</p>
                    <h3 className="mt-3 text-xl font-semibold">
                        Content Ideas That Keep Readers Coming Back
                    </h3>

                    <p className="mt-3 text-slate-600">
                       Explore blog formats, storytelling, techniques, and topic planning ideas that help build a loyal audience. 
                    </p>

                    <Link 
                    to="/blog/content-ideas-that-keep-readers-coming-back"
                    className="inline-block mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                    
                    >
                        Read More
                    </Link>
                </article>
            </div>
        </section>
           
)
}




export default BlogPage;