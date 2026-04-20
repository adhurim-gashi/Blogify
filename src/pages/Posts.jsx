const Posts = () => {
    return (
       <div>
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Posts</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Create Post
            </button>
        </div>

        <div className="bg-white mt-6 rounded-xl shadow p-4">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">Title</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-b">
                        <td className="py-2">How to Build a Blog CMS</td>
                        <td>Published</td>
                        <td>2026-04-11</td>
                    </tr>

                    <tr>
                        <td className="py-2">UI Trends</td>
                        <td>Published</td>
                        <td>2026-04-10</td>
                    </tr>
                </tbody>
            </table>
        </div>
       </div>
    )
}


export default Posts;