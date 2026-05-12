import { Link } from "react-router";

const NotFoundPage = () => {
return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            404 Error
        </p>

        <h2 className="mt-4 text-4xl font-bold text-slate-900">
            Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link 
            to="/home"
            className="w-full rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition duration-300 hover:bg-blue-600 sm:w-auto"
            >
                Back to Home
            </Link>

            <Link
            to="/blog"
            className="w-full rounded-md border border-slate-300 px-5 py-3 font-medium text-slate-700 transition duration-300 hover:border-blue-500 hover:text-blue-500 sm:w-auto"
            >

            Browse Blog
            </Link>
        </div>
    </section>
)
}


export default NotFoundPage;