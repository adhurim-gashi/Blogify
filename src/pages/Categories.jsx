import { Link } from "react-router";

const Categories = () => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>

                <Link 
                to="/categories/create"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Add Category
                </Link>
            </div>

            <div className="bg-white mt-6 rounded-xl shadow p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                        <tr className="border-b">
                        <td className="py-2">Technology</td>
                        <td>technology</td>
                        <td>Articles about tech and software</td>
                        <td className="py-2">
                            <div className="flex gap-2">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                Edit
                            </button>

                            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                Delete
                            </button>
                            </div>
                        </td>
                        </tr>


                            <tr className="border-b">
                                <td className="py-2">Design</td>
                                <td>design</td>
                                <td>UI, UX, and design inspiration</td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            Edit    
                                        </button>

                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2">Business</td>
                                <td>business</td>
                                <td>Content about startups and growth</td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            Edit
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Categories;