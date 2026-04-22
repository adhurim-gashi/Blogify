import { Link } from "react-router";

const CreatePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Add Page</h1>
            <p className="mt-2 text-slate-600">
                Create a static page, such as About, Contact etc. 
            </p>

            <div className="bg-white rounded-xl shadow-p-6 mt-6">
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Page Title
                        </label>

                        <input 
                        type="text"
                        placeholder="Enter page title"
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Slug
                        </label>
                        <input 
                        type="text"
                        placeholder="page-slug"
                        className="w-full border-border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Content
                        </label>
                        <textarea
                        rows="8"
                        placeholder="Write page content here..."
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Link 
                        to="/pages"
                        className="px-4 py-2 rounded-md border border-slate-300 text-slate-700"
                        >
                            Cancel
                        </Link>
                        <button 
                        type="submit"
                        className="px-4 py-2 rounded-md bg-blue-500 text-white"
                        >
                        Save Page
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePage;