import { Link } from "react-router";

const UploadMedia = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Upload Media</h1>
            <p className="mt-2 text-slate-600">
                Upload new images or documents to your media library.
            </p>

            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            File Name
                        </label>

                        <input 
                        type="text"
                        placeholder="Enter file name"
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            File Type
                        </label>
                        <select className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Image</option>
                            <option>Document</option>
                            <option>Video</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload File
                        </label>
                        <input 
                        type="file"
                        className="w-full border-slate-300 rounded-md px-4 py-2 bg-white"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Link 
                        to="/media"
                        className="px-4 py-2 rounded-md border border-slate-300 text-slate-700"
                        >
                            Cancel
                        </Link>

                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white">
                            Upload File
                        </button>
                    </div>
                
                </form>
            </div>
        </div>
    )
}

export default UploadMedia;