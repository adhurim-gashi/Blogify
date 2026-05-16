import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../../api";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts?perPage=100");
      if (res.success && res.data.posts) {
        const publishedPosts = res.data.posts.filter(p => p.status === "PUBLISHED");
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(post =>
      (post.title || "").toLowerCase().includes(query) ||
      (post.excerpt || "").toLowerCase().includes(query) ||
      (post.categories || []).some(cat => cat.name.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Blog Articles
        </p>
        <h2 className="mt-4 text-4xl font-bold">Latest Posts</h2>
        <p className="mt-4 text-lg text-slate-600">
          Explore articles, tutorials, and insights from the Blogify platform.
        </p>
      </div>

      <div className="mt-8 max-w-xl">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search Posts
        </label>

        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full border border-slate-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="mt-12 text-center">
          <p className="text-slate-500">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-slate-500">
            {searchQuery ? "No posts match your search." : "No posts available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-blue-500 font-medium">
                {post.categories?.[0]?.name || "Uncategorized"}
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                {post.title}
              </h3>

              <p className="mt-3 text-slate-600 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150)}
              </p>

              <div className="mt-3 text-sm text-slate-500">
                {new Date(post.createdAt).toLocaleDateString()} · {post.views || 0} views
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="inline-block mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogPage;
