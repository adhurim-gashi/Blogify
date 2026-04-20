import { Link } from "react-router";

const Posts = () => {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link 
          to="/posts/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create Post
          </Link>
        </div>
  
        {/* Table */}
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
  
            <tbody>
              <tr className="border-b">
                <td className="py-2">How to Build a Blog CMS</td>
  
                {/* Status Badge */}
                <td>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                    Published
                  </span>
                </td>
  
                <td>2026-04-11</td>
  
                {/* Actions */}
                <td className="py-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                    Delete
                  </button>
                </td>
              </tr>
  
              <tr>
                <td className="py-2">UI Trends</td>
  
                {/* Status Badge */}
                <td>
                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                    Draft
                  </span>
                </td>
  
                <td>2026-04-10</td>
  
                {/* Actions */}
                <td className="py-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  export default Posts;