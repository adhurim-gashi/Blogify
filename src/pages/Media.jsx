import { Link } from "react-router";

const Media = () => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Media</h1>
                <Link
                to="/media/upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Upload Media
                </Link>
            </div>
            <p className="mt-2 text-slate-600">
                Manage uploaded images and media files.
            </p>

            <div className="bg-white mt-6 rounded-xl shadow p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">File Name</th>
                                <th>Type</th>
                                <th>Uploaded By</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="py-2">hero.banner.jpg</td>
                                <td>Image</td>
                                <td>Adhurim Gashi</td>
                                <td>2026-04-22</td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            View
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2">team-photo.png</td>
                                <td>Image</td>
                                <td>Albion Krasniqi</td>
                                <td>2026-04-22</td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            View
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            
                            <tr className="border-b">
                                <td className="py-2">Document</td>
                                <td>Image</td>
                                <td>Fatlind Ukaj</td>
                                <td>2026-04-22</td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            View
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

export default Media;