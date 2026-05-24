import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { api, API_ORIGIN } from "../../api";

const emptyStats = {
  totalPosts: 0,
  totalCategories: 0,
  totalTags: 0,
  totalSubscribers: 0,
};

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const imageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

const PostSkeleton = () => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <div className="h-36 animate-pulse rounded-md bg-slate-200" />
    <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-200" />
    <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-slate-200" />
    <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
    <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
  </div>
);

const EmptyState = ({ children }) => (
  <div className="rounded-lg border border-dashed bg-white px-6 py-10 text-center text-slate-500">
    {children}
  </div>
);

const PostCard = ({ post, compact = false }) => {
  const featuredImage = imageUrl(post.featuredImage);

  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {featuredImage ? (
        <img
          src={featuredImage}
          alt={post.title}
          className={`${compact ? "h-32" : "h-40"} w-full object-cover`}
        />
      ) : (
        <div className={`${compact ? "h-32" : "h-40"} flex items-center justify-center bg-slate-100 px-5 text-center text-sm font-medium text-slate-500`}>
          {post.category?.name || "Blogify"}
        </div>
      )}

      <div className="p-5">
        <p className="text-sm font-medium text-blue-500">
          {post.category?.name || "Uncategorized"}
        </p>
        <h3 className={`${compact ? "mt-2 text-lg" : "mt-3 text-xl"} font-semibold leading-snug text-slate-950`}>
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {post.excerpt || "Read the full article on Blogify."}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>{post.author?.name || "Blogify"}</span>
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-block rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

const HomePage = () => {
  const location = useLocation();
  const accessDenied = location.state?.accessDenied;
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriberError, setSubscriberError] = useState("");
  const [subscriberMessage, setSubscriberMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      setPageError("");
      try {
        const [featuredRes, statsRes, recentRes] = await Promise.all([
          api.get("/home/featured-posts", { needsAuth: false }),
          api.get("/home/stats", { needsAuth: false }),
          api.get("/home/recent-posts", { needsAuth: false }),
        ]);

        if (!isActive) return;

        setFeaturedPosts(featuredRes.data?.posts || []);
        setRecentPosts(recentRes.data?.posts || []);
        setStats(statsRes.data?.stats || emptyStats);
      } catch (err) {
        if (isActive) {
          setPageError(err.message || "Homepage data could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = subscriberEmail.trim();
    setSubscriberMessage("");
    setSubscriberError("");

    if (!email) {
      setSubscriberError("Please enter your email address.");
      return;
    }

    setIsSubscribing(true);
    try {
      const res = await api.post("/home/newsletter/subscribe", { email }, { needsAuth: false });
      setSubscriberMessage(res.message || "Subscription saved successfully.");
      setSubscriberEmail("");
      setStats((current) => ({
        ...current,
        totalSubscribers: current.totalSubscribers + 1,
      }));
    } catch (err) {
      setSubscriberError(err.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const statItems = [
    { label: "Published Posts", value: stats.totalPosts },
    { label: "Categories", value: stats.totalCategories },
    { label: "Tags", value: stats.totalTags },
    { label: "Subscribers", value: stats.totalSubscribers },
  ];

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16">
        {accessDenied && (
          <div className="mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Access denied. Reader accounts can browse the public site but cannot open admin pages.
          </div>
        )}

        {pageError && (
          <div className="mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              Modern CMS Blog Platform
            </p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">
              Share ideas, publish stories, and manage your content with ease
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Explore published stories, categories, and community updates powered by the live Blogify API.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600"
              >
                Explore Blog
              </Link>
              <a
                href="#newsletter"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-500"
              >
                Subscribe
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-lg border bg-white p-4 shadow-sm">
                {isLoading ? (
                  <>
                    <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-slate-950">{item.value.toLocaleString()}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Featured Posts</h3>
            <p className="mt-2 text-slate-600">Selected published posts marked as featured.</p>
          </div>
          <Link to="/blog" className="text-sm font-medium text-blue-500 hover:text-blue-600">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : featuredPosts.length === 0 ? (
          <EmptyState>No featured published posts are available yet.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Recent Posts</h3>
            <p className="mt-2 text-slate-600">The latest published articles from the database.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : recentPosts.length === 0 ? (
            <EmptyState>No published posts are available yet.</EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="newsletter" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h3 className="text-2xl font-bold">Stay Updated</h3>
          <p className="mt-3 text-slate-600">
            Subscribe to receive the latest published posts and updates from Blogify.
          </p>
          <form className="mt-6 flex flex-col justify-center gap-3 sm:flex-row" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
            />

            <button
              type="submit"
              disabled={isSubscribing}
              className="rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {subscriberError && (
            <p className="mt-3 text-center text-sm text-red-500">
              {subscriberError}
            </p>
          )}
          {subscriberMessage && (
            <p className="mt-3 text-center text-sm text-green-600">
              {subscriberMessage}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
