import { PostProps } from "@/Interfaces/PostProps";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { FaHeart, FaLaughBeam, FaSadCry, FaThumbsUp } from "react-icons/fa";
import { SimpleDialogContainer, simpleConfirm } from "react-simple-dialogs";
import PostHeader from "./PostHeader";
import PostBottomSection from "./PostBottomSection";
export default function Post({
    post,
    postsAmount,
    auth,
}: PageProps<{ post: PostProps; postsAmount: number }>) {
    return (
        <>
            {post && (
                <article className="p-3 flex-col space-y-4 text-white bg-gray-900 rounded-xl  w-full lg:w-2/3">
                    <SimpleDialogContainer />
                    <PostHeader post={post} postsAmount={postsAmount} />
                    <main>
                        <div>
                            <img
                                className="w-full rounded-xl"
                                src={`http://localhost:8000/storage/${post.image}`}
                            />
                        </div>
                        <PostBottomSection
                            commentsAmount={post.commentsAmount}
                            commentsRoute={post.commentsRoute}
                            likes={post.likes}
                            postId={post.id}
                        />
                    </main>
                </article>
            )}
        </>
    );
}
