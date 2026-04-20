import { Link } from "react-router";

const CreateTag = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Add Tag</h1>
            <p className="mt-2 text-slate-600">
                Create a new tag to help organize and filter blog posts.
            </p>


            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tag Name
                        </label>

                        <input 
                        type="text"
                        placeholder="Enter tag name"
                        className="w-full border border-slate-300 rounded-md px-4 y-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Slug
                            </label>
                            <input 
                            type="text"
                            placeholder="tag-slug"
                            className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Link 
                            to="/tags"
                            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700">
                                Cancel
                            </Link>

                            <button 
                            type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white">
                                Save Tag
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default CreateTag;