const Settings = () => {
return (
    <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-slate-600">
            Manage general website settings and configuration. 
        </p>

        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Site Name
                    </label>

                    <input 
                    type="text"
                    placeholder="Enter site name"
                    className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Site Description
                    </label>
                    <textarea
                    rows="4"
                    placeholder="Enter site description"
                    className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
               
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Posts Per Page
                    </label>
                  <input 
                  type="number"
                  placeholder="10"
                  className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Comments Enabled
                    </label>
                    <select className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Yes</option>
                    <option>No</option>
                    </select>
                </div>

                <div className="pt-2">
                    <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-500 text-white"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}



export default Settings; 