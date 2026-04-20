import { Link } from "react-router";

const CreatePost = () => {
return (
    <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="mt-2 text-slate-600">
            Fill in the details below to publish a new blog post.
        </p>

        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title
                    </label>
                    <input 
                      type="text"
                      placeholder="Enter post title"
                      className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category
                        </label>
                        <select className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Technology</option>
                            <option>Design</option>
                            <option>Business</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Status
                        </label>
                        <select className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Draft</option>
                            <option>Published</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Featured Image
                    </label>
                    <input 
                    type="file"
                    className="w-full border border-slate-300 rounded-md px-4 py-2 bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Content
                    </label>
                    <textarea
                        rows="8"
                        placeholder="Write your post content here..."
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">

                    </textarea>
                </div>

                <div className="flex gap-3 pt-2">
                    <Link className="px-4 py-2 rounded-md border border-slate-300 text-slate-700"
                    to="/posts">
                        Cancel
                    </Link>
                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white">
                        Publish
                    </button>

                </div>
            </form>
        </div>
    </div>
)
}

export default CreatePost;