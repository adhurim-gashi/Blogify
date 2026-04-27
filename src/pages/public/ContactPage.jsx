const ContactPage = () => {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
                <section className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                        Contact Us
                    </p>
                    <h2 className="mt-4 text-4xl font-bold">
                        Get in touch with the Blogify team. 
                    </h2>

                    <p className="mt-6 text-lg text-slate-600">
                        Have a question, suggestion or feedback? Send us a message and we'll get back to you as soon as possible.
                    </p>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-xl font-semibold">Send a Message</h3>

                        <form className="space-y-5 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input 
                                type="text"
                                placeholder="Enter your name"
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
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
                                    Message
                                </label>

                                <textarea
                                rows="6"
                                placeholder="Write your message..."
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <button type="submit" className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-3xl font-semibold">Project Information</h3>
                        <div className="space-y-5 mt-6 text-slate-600">
                            <div>
                                <p className="font-medium text-slate-900">Project</p>
                                <p>Blogify CMS Platform</p>
                            </div>

                            <div>
                                <p className="font-medium text-slate-900">Team</p>
                                <p>Adhurim Gashi, Albion Krasniqi, Fatlind Ukaj</p>
                            </div>


                            <div>
                                <p className="font-medium text-slate-900">Purpose</p>
                                <p>
                                    A student project for managing blog posts, categories, tags, comments, media, page, users, and newsletter subscribers. 
                                </p>
                            </div>

                            <div>
                                <p className="font-medium text-slate-900">Email</p>
                                <p>adhurimgashi.dev@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
    )
}



export default ContactPage;