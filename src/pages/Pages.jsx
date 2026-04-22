import { Link } from "react-router";

const Pages = () => {
    return (
    <div>
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Pages</h1>

            <Link
            to="/pages/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Add Page
            </Link>
        </div>

        <div className="bg-white mt-6 rounded-xl shadow p-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Title</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b">
                            <td className="py-2">About Us</td>
                            <td>about-us</td>
                            <td>
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                                    Published
                                </span>
                            </td>
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
                            <td className="py-2">Contact</td>
                            <td>contact</td>
                            <td>
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                                    Published
                                </span>
                            </td>
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
                           <td className="py-2">Privacy Policy</td> 
                           <td>privacy-policy</td>
                           <td>
                            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                                Draft
                            </span>
                           </td>
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


export default Pages;