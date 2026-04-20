import { Link } from "react-router";

const Tags = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags</h1>

        <Link
          to="/tags/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Tag
        </Link>
      </div>

      <div className="bg-white mt-6 rounded-xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">Web Development</td>
                <td>web-development</td>
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
                <td className="py-2">Tutorials</td>
                <td>tutorials</td>
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
                <td className="py-2">Productivity</td>
                <td>productivity</td>
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
                <td className="py-2">Case Study</td>
                <td>case-study</td>
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
  );
};

export default Tags;
