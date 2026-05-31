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
    const [replyTextById, setReplyTextById] = useState({});
    const [replyingTo, setReplyingTo] = useState("");
    const [loading, setLoading] = useState(true);
    const [articleReactionLoading, setArticleReactionLoading] = useState(false);
    const [commentReactionLoading, setCommentReactionLoading] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            setMessage("");
            try {
                const postRes = await api.get(`/posts/${slug}`, { needsAuth: Boolean(user) });
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
    }, [slug, user]);

    useEffect(() => {
        if (!post) return;
        const previousTitle = document.title;
        const setMeta = (property, content) => {
            if (!content) return;
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        document.title = post.metaTitle || post.title;
        setMeta("og:title", post.metaTitle || post.title);
        setMeta("og:description", post.metaDescription || post.excerpt);
        setMeta("og:image", post.ogImage);
        setMeta("og:type", "article");

        return () => {
            document.title = previousTitle;
        };
    }, [post]);

    const threadComments = (items) => {
        const byId = new Map(items.map(comment => [comment.id, { ...comment, replies: [] }]));
        const roots = [];
        byId.forEach(comment => {
            if (comment.parentId && byId.has(comment.parentId)) {
                byId.get(comment.parentId).replies.push(comment);
            } else {
                roots.push(comment);
            }
        });
        return roots;
    };

    const handleArticleReaction = async (type) => {
        if (!user) {
            setMessage("You must be logged in to react to posts.");
            navigate("/login");
            return;
        }

        try {
            setArticleReactionLoading(true);
            const res = await api.post(`/posts/${post.id}/react`, { type });
            if (res.success) {
                setPost(current => ({
                    ...current,
                    likeCount: res.data.likeCount,
                    dislikeCount: res.data.dislikeCount,
                    userReaction: res.data.userReaction,
                }));
                setMessage(res.message || "Reaction saved.");
            }
        } catch (err) {
            setMessage(err.message || "Unable to react to this post.");
        } finally {
            setArticleReactionLoading(false);
        }
    };

    const handleCommentSubmit = async (e, parentId = null) => {
        e.preventDefault();
        if (!user) {
            setMessage("You must be logged in to comment.");
            navigate("/login");
            return;
        }
        const text = parentId ? replyTextById[parentId] || "" : commentText;
        if (!text.trim()) {
            setMessage("Please enter a comment.");
            return;
        }

        try {
            const res = await api.post("/comments", {
                content: text.trim(),
                postId: post.id,
                parentId: parentId || undefined,
            });
            if (res.success) {
                if (parentId) {
                    setReplyTextById(prev => ({ ...prev, [parentId]: "" }));
                    setReplyingTo("");
                } else {
                    setCommentText("");
                }
                setMessage("Comment submitted for moderation.");
            } else {
                setMessage(res.message || res.error || "Failed to post comment");
            }
        } catch (err) {
            setMessage(err.message || "Error posting comment");
        }
    };

    const handleCommentReaction = async (commentId) => {
        if (!user) {
            setMessage("You must be logged in to like comments.");
            navigate("/login");
            return;
        }

        try {
            setCommentReactionLoading(commentId);
            const res = await api.post(`/comments/${commentId}/react`, { type: "LIKE" });
            if (res.success) {
                setComments(current => current.map(comment =>
                    comment.id === commentId
                        ? { ...comment, reactionCount: res.data.reactionCount }
                        : comment
                ));
            }
        } catch (err) {
            setMessage(err.message || "Unable to react to comment.");
        } finally {
            setCommentReactionLoading("");
        }
    };

    const renderComment = (comment, depth = 0) => (
        <div key={comment.id} className={`${depth > 0 ? "ml-4 border-l border-slate-200 pl-4" : ""}`}>
            <div className="rounded-xl bg-white p-5 shadow">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{comment.author?.name || "Reader"}</h4>
                    <span className="text-sm text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <p className="mt-3 text-slate-600">
                    {comment.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <button
                        type="button"
                        onClick={() => handleCommentReaction(comment.id)}
                        disabled={commentReactionLoading === comment.id}
                        className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {commentReactionLoading === comment.id ? "Saving..." : `Like (${comment.reactionCount || 0})`}
                    </button>
                    <button
                        type="button"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? "" : comment.id)}
                        className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
                    >
                        Reply
                    </button>
                </div>

                {replyingTo === comment.id && (
                    <form className="mt-4 space-y-3" onSubmit={(e) => handleCommentSubmit(e, comment.id)}>
                        <textarea
                            rows="3"
                            value={replyTextById[comment.id] || ""}
                            onChange={(e) => setReplyTextById(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            placeholder="Write a reply..."
                            className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                            Post Reply
                        </button>
                    </form>
                )}
            </div>

            {comment.replies?.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => renderComment(reply, depth + 1))}
                </div>
            )}
        </div>
    );

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
                    || message.includes("Reaction")
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
                    className="blogify-editor mt-6 text-slate-700"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-10 pt-6 border-t">
                        <p className="text-sm font-medium text-slate-700 mb-4">
                            Was this article helpful?
                        </p>

                        <div className="flex gap-4">
                            <button className={`border px-4 py-2 rounded-md font-medium transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                                post.userReaction === "LIKE"
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                            }`}
                            onClick={() => handleArticleReaction("LIKE")}
                            disabled={articleReactionLoading}
                            >
                            {articleReactionLoading ? "Saving..." : `Like (${post.likeCount || 0})`}
                            </button>
                            <button className={`border px-4 py-2 rounded-md font-medium transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                                post.userReaction === "DISLIKE"
                                    ? "border-red-600 bg-red-600 text-white"
                                    : "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                            }`}
                            onClick={() => handleArticleReaction("DISLIKE")}
                            disabled={articleReactionLoading}
                            >
                            {articleReactionLoading ? "Saving..." : `Dislike (${post.dislikeCount || 0})`}
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
                        <form className="space-y-5" onSubmit={(e) => handleCommentSubmit(e)}>
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
                            threadComments(comments).map(comment => renderComment(comment))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePost;
