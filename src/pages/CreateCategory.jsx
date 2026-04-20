import { Link } from "react-router";

const CreateCategory = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Add Category</h1>
      <p className="mt-2 text-slate-600">
        Create a new category for organizing blog posts.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              placeholder="category-slug"
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              rows="5"
              placeholder="Write a short description..."
              className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/categories"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 text-white"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
