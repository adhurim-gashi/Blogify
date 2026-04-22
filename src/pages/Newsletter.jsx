const Newsletter = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Newsletter</h1>
            <p className="mt-2 text-slate-600">
                Manage newsletter subscribers and their subscription status.
            </p>

            <div className="bg-white mt-6 rounded-xl shadow p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Email</th>
                                <th>Date Subscribed</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="py-2">adhurimgashi@example.com</td>
                                <td>2026-04-22</td>
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
                                            Remove
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="py-2">albion@example.com</td>
                                <td>2026-04-21</td>
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
                                            Remove
                                        </button>

                                    </div>
                                </td>
                            </tr>

                           <tr>
                            <td className="py-2">fatlind@example.com</td>
                            <td>2026-04-20</td>
                            <td>
                                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                                    Unsubscribed
                                </span>
                            </td>
                            <td className="py-2">
                                <div className="flex gap-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                        View
                                    </button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                        Remove
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


export default Newsletter;