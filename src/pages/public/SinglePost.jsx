import { Link } from "react-router";

const SinglePost = () => {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
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
                    <span>5 Min Read</span>
                </div>

                <p className="mt-8 text-lg text-slate-700 leading-8">
                    Staying focused has become one of the biggest challenges in modern life.
                    With notifications, busy schedules, and constant information, it is easy to lose track of what really matters. 
                </p>

                <p className="mt-6 text-slate-700 leading-8">
                    Building better habits can help you create structure and reduce distractions. Simple routines like planning your day, setting clear priorities, and taking short breaks can make your work feel more manageable. 
                </p>

                <p className="mt-6 text-slate-700 leading-8">
                    Focus does not come from doing everything at once. It comes from choosing what deserves your attention and giving yourself the right environment to complete it.
                </p>

                <p className="mt-6 text-slate-700 leading-8">
                    Developing focus is not about perfection. It is about creating better habits, staying consistent, and building a routine that supports meaningful work over time.
                </p>

                <div className="mt-10 pt-6 border-t">
                    <p className="text-sm font-medium text-slate-700 mb-4">
                        Was this article helpful?
                    </p>


                    <div className="flex gap-4">
                        <button className="border border-green-500 text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-500 hover:text-white transition duration-300">
                        👍 Like (24)
                        </button>
                        <button className="border border-red-500 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-500 hover:text-white transition duration-300">
                        👎 Dislike (16)

                        </button>
                    </div>
                </div>
            </article>


            <div className="mt-12">
                <h3 className="text-2xl font-bold">Comments</h3>
                <p className="mt-2 text-slate-600">
                    Share your thoughts about this post.
                </p>


                <div className="bg-white rounded-xl shadow p-6 mt-6">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Your Comment
                            </label>


                            <textarea
                            rows="5"
                            placeholder="Write your comment..."
                            className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <button
                        type="submit"
                        className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                        >
                            Post Comment
                        </button>
                    </form>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Albion Krasniqi</h4>
                            <span className="text-sm text-slate-500">2026-04-28</span>
                        </div>

                        <p className="mt-3 text-slate-600">
                            This was a very useful article. I liked the part about building habits and reducing distractions.
                        </p>
                    </div>


                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Fatlind Ukaj</h4>
                            <span className="text-sm text-slate-500">2026-04-27</span>
                        </div>
                    
                    <p className="mt-3 text-slate-600">
                        Great explanation. It would also be interesting to include some real-life examples of focus routines.
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SinglePost;