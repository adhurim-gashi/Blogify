import { Link } from "react-router";

const HomePage = () => {
    return (
   

               <>
                <section className="mx-auto max-w-6xl px-6 py-16">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                            Modern CMS Blog Platform
                        </p>
                        <h2 className="mt-4 text-5xl font-bold leading-tight">Share ideas, publish stories, and manage your content with ease</h2>
                        <p className="mt-6 text-lg text-slate-600">
                            Blogify is a modern blog content managment system built for writing, organizing, and publishing articles with categories, tags, comments, and media management.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Link
                            to="/blog"
                            className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium"
                            >
                                Explore Blog
                            </Link>
                            <Link
                            to="/about"
                            className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                  </section>

                <section className="mx-auto max-w-6xl px-6 pb-16">
                    <h3 className="text-2xl font-bold mb-6">Featured Posts</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <article className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-blue-500 font-medium">Technology</p>
                            <h4 className="mt-3 text-xl font-semibold">
                                How to Build a Blog CMS
                            </h4>
                            <p className="mt-3 text-slate-600">
                                Learn the core structure of building a CMS with posts, categories, tags, comments, and media.
                            </p>
                        </article>


                        <article className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-blue-500 font-medium">Design</p>
                            <h4 className="mt-3 text-xl font-semibold">
                                UI Trends in 2026
                            </h4>

                            <p className="mt-3 text-slate-600">
                                Explore modern interface ideas, clean layours, and user-friendly design patterns for web apps.
                            </p>
                        </article>


                        <article className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-blue-500 font-medium">Productivity</p>
                            <h4 className="mt-3 text-xl font-semibold">
                                Writing Better Blog Content
                            </h4>

                            <p className="mt-3 text-slate-600">
                                Tips for planning, structuring, and publishing more useful content for your readers.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="bg-white border-t">
                    <div className="mx-auto max-w-6xl px-6 py-16">
                        <h3 className="text-2xl font-bold">Why Blogify?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="rounded-xl border p-5">
                                <h4 className="font-semibold text-lg">Content Managment</h4>
                                <p className="mt-2 text-slate-600">
                                    Create, edit, organize, and publish blog content through a clean admin panel.
                                </p>
                            </div>

                            <div className="rounded-xl border p-5">
                                <h4 className="font-semibold text-lg">Reader Interaction</h4>
                                <p className="mt-2 text-slate-600">Manage comments, encourage engagement, and keep communication active.</p>
                            </div>

                            <div className="rounded-xl border p-5">
                                <h4 className="font-semibold text-lg">Flexible Publishing</h4>
                                <p className="mt-2 text-slate-600">
                                    Use categories, tags, pages, and media to build a complete publishing platform
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                </>
            
       
    )
}

export default HomePage;