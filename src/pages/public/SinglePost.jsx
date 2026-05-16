import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { api } from "../../api";
import { useAuth } from "../../auth-context";

const SinglePost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            setMessage("");
            try {
                const postRes = await api.get(`/posts/${slug}`, { needsAuth: false });
                const loadedPost = postRes.data?.post || postRes.data;
                setPost(loadedPost);

                if (loadedPost?.id) {
                    const commentRes = await api.get(`/comments/post/${loadedPost.id}`, { needsAuth: false });
                    setComments(commentRes.data?.comments || []);
                }
            } catch (err) {
                setMessage(err.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    const handleReaction = () => {
        if (!user) {
            navigate("/login");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        if (!commentText.trim()) {
            setMessage("Please enter a comment.");
            return;
        }

        try {
            const res = await api.post("/comments", {
                content: commentText.trim(),
                postId: post.id,
            });
            if (res.success) {
                setCommentText("");
                setMessage("Comment submitted for moderation.");
            } else {
                setMessage(res.message || res.error || "Failed to post comment");
            }
        } catch (err) {
            setMessage(err.message || "Error posting comment");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-12 text-slate-600">
                Loading post...
            </div>
        );
    }

    if (!post && !message) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <Link
            to="/blog"
            className="inline-block mb-8 text-blue-500 font-medium"
            >
                Back to Blog
            </Link>

            {message && (
                <div className={`mb-6 p-3 rounded-md text-sm ${
                    message.includes("moderation")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                }`}>
                    {message}
                </div>
            )}

            {post && (
                <article className="bg-white rounded-xl shadow p-8">
                    <p className="text-sm text-blue-500 font-medium">
                        {post.categories?.[0]?.name || "Uncategorized"}
                    </p>
                    <h1 className="mt-4 text-4xl font-bold leading-tight">
                        {post.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>By {post.author?.name || post.author?.username || "Blogify"}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.views || 0} views</span>
                    </div>

                    {post.excerpt && (
                        <p className="mt-8 text-lg text-slate-700 leading-8">
                            {post.excerpt}
                        </p>
                    )}

                    <div
                    className="mt-6 text-slate-700 leading-8"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-10 pt-6 border-t">
                        <p className="text-sm font-medium text-slate-700 mb-4">
                            Was this article helpful?
                        </p>

                        <div className="flex gap-4">
                            <button className="border border-green-500 text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-500 hover:text-white transition duration-300"
                            onClick={handleReaction}
                            >
                            Like
                            </button>
                            <button className="border border-red-500 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-500 hover:text-white transition duration-300"
                            onClick={handleReaction}
                            >
                            Dislike
                            </button>
                        </div>
                    </div>
                </article>
            )}

            {post && (
                <div className="mt-12">
                    <h3 className="text-2xl font-bold">Comments</h3>
                    <p className="mt-2 text-slate-600">
                        Share your thoughts about this post.
                    </p>

                    <div className="bg-white rounded-xl shadow p-6 mt-6">
                        <form className="space-y-5" onSubmit={handleCommentSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Comment
                                </label>

                                <textarea
                                rows="5"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment..."
                                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <button
                            type="submit"
                            className="bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                            >
                                Post Comment
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-slate-500">No approved comments yet.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="bg-white rounded-xl shadow p-5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{comment.author?.name || "Reader"}</h4>
                                        <span className="text-sm text-slate-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-slate-600">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePost;
