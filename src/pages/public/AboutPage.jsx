import adhurim from "../../assets/team/adhurim.jpg"; 
import albion from "../../assets/team/albion.jpeg"; 


const AboutPage = () => {

    return (
        <div className="mx-auto max-w-6xl px-16 py-16">
            <section className="max-w-3xl mx-auto">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                    About Blogify
                </p>

                <h2 className="mt-4 text-4xl font-bold">
                    Platform built for managing blog content.
                </h2>
                <p className="mt-6 text-lg text-slate-600">
                    Blogify is a student project, created to manage posts, categories, tags, comments, pages, media newsletter subscribers, users, and website settings through a clean admin dashboard.
                </p>
            </section>

            <section className="mt-16">
                <h3 className="text-2xl font-bold text-center">Meet the Team</h3>
                <p className="mt-2 text-slate-600 text-center">
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

                    <div className="bg-white rounded-xl shadow p-5 text-center">
                        <img 
                        src={albion}
                        alt="Albion Krasniqi"
                        className="w-32 h-32 rounded-full object-cover mx-auto"
                        />
                        <h4 className="mt-4 text-xl font-semibold">Albion Krasniqi</h4>
                        <p className="mt-1 text-blue-500 font-medium">Backend</p>
                        <p className="mt-3 text-slate-600">
                            Focused on server, structure, API planning, and backend logic.
                        </p>
                    </div>

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
        </div>
    )
}


export default AboutPage;