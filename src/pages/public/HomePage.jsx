import { Link } from "react-router";
import { useState } from "react";
import { api } from "../../api"; 

const featuredPosts = [
    {
        category: "Publishing",
        title: "How to Plan Your First Blog Post", 
        description: "Learn how to turn an idea into a clear, organized article that readers will actually want to finish", 
        meta: "Blogify Team · 5 min read", 
        path: "/blog"
    },
    {
        category: "Design", 
        title: "Creating a Better Reading Experience", 
        description: 
        "Simple layout, strong typography, and clean structure can make your blog feel more professional.",
        meta: "Editor Notes · 4 min read.",
        path: "/blog",
    }, 
    {
        category: "Writing", 
        title: "Writing Content That Feels Useful", 
        description: 
        "Practical tips for writing posts that are easier to read easier to share, and easier to manage.", 
        meta: "Content Guide · 6 min read", 
        path: "/blog", 
    },
]; 

const HomePage = () => {
    const [subscriberEmail, setSubscriberEmail] = useState(""); 
    const [subscriberError, setSubscriberError] = useState(""); 
    const [subscriberMessage, setSubscriberMessage] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault(); 
        setSubscriberMessage(""); 

        if (!subscriberEmail.trim()) {
            setSubscriberError("Please enter your email address."); 
            return; 
        }

        if (!subscriberEmail.includes("@")) {
            setSubscriberError("Please enter a valid email address.");
            return; 
        }

        setSubscriberError(""); 

        try {
            const res = await api.post(
                "/newsletter/subscribe", 
                { email: subscriberEmail }, 
                { needsAuth: false }
            ); 

            if (res.success) {
                setSubscriberMessage("You have successfully joined the newsletter."); 
                setSubscriberEmail("");
            } else {
                setSubscriberError(res.message || res.error || "Subscription failed.")
            }
        } catch (err) {
            setSubscriberError(err.message || "Subscription failed.");
        }
    }; 

    return (
        <>
        <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                        Blogify Publishing Platform
                    </p>
                    <h2 className="mt-4 text-5xl font-bold leading-tight">
                        Write, organize, and publish stories from one simple workspace
                    </h2>
                    
                    <p className="mt-6 text-lg text-slate-600">
                        Blogify helps writers, editors, and creators manage articles, categories, tags, comments, and media in a clean publishing experience. 
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link 
                        to="/blog"
                        className="rounded-md bg-blue-500 px-5 py-4 text-center font-medium text-white transition duration-300 hover:bg-blue-600">
                            Explore Articles
                        </Link>

                        <Link 
                        to="/about"
                        className="rounded-md border border-blue-100 bg-blue-50 px-5 py-4 text-center font-medium text-blue-600 transition duration-300 hover:border-blue-500 hover:bg-blue-100">
                            About Blogify
                        </Link>
                    </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow">
                    <div className="flex items-center justify-between border-b border-slate-200">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Publishing Overview
                            </p>
                            <p className="text-sm text-slate-500">
                                Today on Blogify
                            </p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Live</span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-md bg-slate-50 p-4">
                            <p className="text-2xl font-bold text-slate-900">24</p>
                            <p className="mt-1 text-xs text-slate-500">Posts</p>
                        </div>

                        <div className="rounded-md bg-slate-50 p-4">
                            <p className="text-2xl font-bold text-slate-900">8</p>
                            <p className="mt-1 text-xs text-slate-500">Categories</p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-4">
                            <p className="text-2xl font-bold text-slate-900">132</p>
                            <p className="mt-1 text-xs text-slate-500">Readers</p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="rounded-md border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                                How to Build Better Blog Content
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Draft · Writing · 6 min read
                            </p>
                        </div>

                        <div className="rounded-md border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                                A Cleaner Way to Manage Posts
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Published · CMS · 4 min read
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
            <h3 className="mb-6 text-2xl font-bold">Featured Reads</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {featuredPosts.map((post) => (
                    <Link 
                    key={post.title}
                    to={post.path}
                    className="rounded-lg bg-white p-5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <p className="text-sm font-medium text-blue-500">
                            {post.category}
                        </p>
                        <h4 className="mt-3 text-xl font-semibold text-slate-900">
                            {post.title}
                        </h4>

                        <p className="mt-3 text-slate-600">
                            {post.description}
                        </p>

                        <p className="mt-4 text-sm text-slate-400">
                            {post.meta}
                        </p>
                    </Link>
                ))}
            </div>
        </section>

        <div className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <h3 className="text-2xl font-bold">Why Choose Blogify?</h3>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg border p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 font-bold text-blue-500">
                            P
                        </div>
                        <h4 className="text-lg font-semibold">Organized Publishing</h4>
                        <p className="mt-2 text-slate-600">
                            Keep posts, categories, tags, pages, and media organized in one simple content system.
                        </p>
                    </div>

                    <div className="rounded-lg border p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 font-bold text-blue-500">
                            R
                        </div>
                        <h4 className="text-lg font-semibold">Reader Engagement</h4>
                        <p className="mt-2 text-slate-600">
                            Support comments, conversations, and community interaction around every published article.
                        </p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 font-bold text-blue-500">

                            C
                        </div>
                        <h4 className="text-lg font-semibold">Flexible Content Tools</h4>
                        <p className="mt-2 text-slate-600">
                            Manage blog posts, static pages, newsletter subscribers, and media without switching tools.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t bg-blue-50">
                <div className="mx-auto max-w-6xl px-6 py-16 text-center">
                    <h3 className="text-2xl font-bold">Join the Blogify Newsletter</h3>
                    <p className="mt-3 text-slate-600">
                        Get fresh articles, writing tips, and platform updates delivered to your inbox.
                    </p>

                    <form
                    className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"
                    onSubmit={handleSubscribe}
                    >
                        <input 
                        type="email"
                        placeholder="Enter your email address"
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
                        />

                        <button
                        type="submit" 
                        className="rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition duration-300 hover:bg-blue-600"
                        >
                            Subscribe Now
                        </button>
                    </form>
                    {subscriberError && (
                        <p className="mt-2 text-center text-sm text-red-500">
                            {subscriberError}
                        </p>
                    )}

                    {subscriberMessage && (
                        <p className="mt-2 text-center text-sm text-green-600">
                            {subscriberMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default HomePage;