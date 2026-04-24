import { Link } from "react-router";
import  adhurim  from "../../assets/team/adhurim.jpg"


const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blogify</h1>

                    
                    <nav className="flex gap-6 text-sm font-medium">
                        <Link to="/home" className="hover:text-blue-500">Home</Link>
                        <Link to="/blog" className="hover:text-blue-500">Blog</Link>
                        <Link to="/about" className="hover:text-blue-500">About</Link>
                        <Link to="/contact" className="hover:text-blue-500">Contact</Link>
                    </nav>
                   
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-16">
                <section className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                        About Blogify
                    </p>
                    <h2 className="mt-4 text-4xl font-bold">
                        A simple CMS platform built for managing blog content.
                    </h2>
                    <p className="mt-6 text-lg text-slate-600">
                        Blogify is a student project created to manage posts, categories, tags, comments, pages, media, newsletter subscribers, users, and website settings through a clean admin dashboard.
                    </p>
                </section>

                <section className="mt-16">
                    <h3 className="text-2xl font-bold">Meet the Team</h3>
                    <p className="mt-2 text-slate-600">
                        The people behind the design, development, and structure of Blogify. 
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-xl shadow p-5 text-center">
                            <img 
                            src={adhurim}
                            alt="Adhurim Gashi"
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold">Adhurim Gashi</h4>
                            <p className="mt-1 text-blue-500 font-medium">Frontend / UI</p>
                            <p className="mt-3 text-slate-600">
                                Worked on the interface, routing, dashboard layout, and public pages.
                            </p>
                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-xl shadow p-5 text-center">
                            <img 
                            src={adhurim}
                            alt="Albion Krasniqi"
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold">Albion Krasniqi</h4>
                            <p className="mt-1 text-blue-500 font-medium">Backend</p>
                            <p className="mt-3 text-slate-600">
                               Focused on server, structure, API planning, and backend logic.
                            </p>
                        </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-xl shadow p-5 text-center">
                            <img 
                            src={adhurim}
                            alt="Fatlind Ukaj"
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold">Fatlind Ukaj</h4>
                            <p className="mt-1 text-blue-500 font-medium">Backend</p>
                            <p className="mt-3 text-slate-600">
                               Worked on database structure, entities, documentation, and project organization.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    )
}




export default AboutPage;