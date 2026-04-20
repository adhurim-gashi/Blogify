const Dashboard = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome back, here is an overview of your blog
        </p>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">Total Posts</p>
            <h2 className="text-2xl font-bold mt-2">128</h2>
            <p className="text-xs text-green-500 mt-1">+12 this month</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">Comments</p>
            <h2 className="text-2xl font-bold mt-2">542</h2>
            <p className="text-xs text-yellow-500 mt-1">18 pending</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">Users</p>
            <h2 className="text-2xl font-bold mt-2">86</h2>
            <p className="text-xs text-blue-500 mt-1">5 new this week</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">Subscribers</p>
            <h2 className="text-2xl font-bold mt-2">1204</h2>
            <p className="text-xs text-green-500 mt-1">+32 today</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
  
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
  
            <ul className="space-y-3">
              <li className="border-b pb-2">How to Build a Blog CMS</li>
              <li className="border-b pb-2">UI Trends in 2026</li>
              <li className="border-b pb-2">Why Categories Matter</li>
              <li>Getting Started with React</li>
            </ul>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Comments</h2>
  
            <ul className="space-y-3">
              <li className="border-b pb-2">“Great article!”</li>
              <li className="border-b pb-2">“Very helpful post”</li>
              <li className="border-b pb-2">“Can you explain more?”</li>
              <li>“Loved this content!”</li>
            </ul>
          </div>
  
        </div>
      </div>
    )
  }
  
  export default Dashboard;