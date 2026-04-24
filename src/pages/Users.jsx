const Users = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="mt-2 text-slate-600">
                Manage registered users and their roles.

            </p>

            <div className="bg-white mt-6 rounded-xl shadow p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="py-2">Adhurim Gashi</td>
                                <td>adhurim@example.com</td>
                                <td>Admin</td>
                                <td>
                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                                        Active
                                    </span>
                                  
                                </td>

                                <td className="py-2">
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                                View
                                            </button>
                                            <button className="bg-red-500 text-white px-3 
                                             py-1 rounded-md text-sm">
                                                Disable
                                            </button>
                                        </div>
                                    </td>
                            </tr>



                            <tr className="border-b">
                                <td className="py-2">Albion Krasniqi</td>
                                <td>albion@example.com</td>
                                <td>Author</td>
                                <td>
                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            View
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                            Disable
                                        </button>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <td className="py-2">Fatlind Uka</td>
                                <td>fatlind@example.com</td>
                                <td>Reader</td>
                                <td>
                                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                                        Inactive
                                    </span>
                                </td>

                                <td className="py-2">
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                            View
                                        </button>
                                        <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                                            Activate
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

export default Users;