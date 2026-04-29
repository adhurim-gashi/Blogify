const ProfilePage = () => {
    return (
        <div className="mx-auto max-w-4xl px-6 py-16">
            <section className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                    My Profile
                </p>
                <h2 className="mt-4 text-4xl font-bold">
                    Manage your account information
                </h2>

                <p className="mt-6 text-lg text-slate-600">
                    View and update your personal details, account role, and profile information.
                </p>
            </section>

            <div className="bg-white rounded-xl shadow p-6 mt-10">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                            Profile Photo
                        </div>

                        <button className="mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300">
                            Change Photo
                        </button>
                    </div>

                    <div className="flex-1 w-full">
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input 
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="block text-sm font-medium text-slate-700 mb-2">
                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address    
                            </label>   

                            <input 
                                type="email"                             
                                placeholder="Enter your email"
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Role
                                </label>

                                <input 
                                type="text"
                                placeholder="User role"
                                className="w-full border border-slate-300 rounded-md px-4 py-2 bg-slate-100 text-slate-500"
                                readOnly
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                rows="5"
                                placeholder="Write a short bio..."
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>


                        <button type="submit" className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300">
                            Save Changes
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProfilePage;