const Comments = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Comments</h1>
        <p className="mt-2 text-slate-600">
          Review and moderate reader comments.
        </p>
  
        <div className="bg-white mt-6 rounded-xl shadow p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">User</th>
                  <th>Comment</th>
                  <th>Post</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
  
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Adhurim Gashi</td>
                  <td>Great article, very helpful</td>
                  <td>How to Build a Blog CMS</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                      Pending
                    </span>
                  </td>
  
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
  
                <tr className="border-b">
                  <td className="py-2">Albion Krasniqi</td>
                  <td>This explanation was clear.</td>
                  <td>UI Trends in 2026</td>
                  <td>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                      Approved
                    </span>
                  </td>
  
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
                  <td className="py-2">Fatlind Uka</td>
                  <td>Can you explain the routing part more?</td>
                  <td>Getting Started With React</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                      Pending
                    </span>
                  </td>
  
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                        Reject
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
  
  export default Comments;
  