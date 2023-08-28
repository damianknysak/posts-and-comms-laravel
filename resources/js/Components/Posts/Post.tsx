import { PostProps } from "@/Interfaces/PostProps";
import { PageProps } from "@/types";
import { SimpleDialogContainer, simpleConfirm } from "react-simple-dialogs";
import PostHeader from "./PostHeader";
import PostBottomSection from "./PostBottomSection";
import { useState } from "react";
import { Blurhash } from "react-blurhash";

export default function Post({
    post,
    postsAmount,
    auth,
}: PageProps<{ post: PostProps; postsAmount: number }>) {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <>
            {post && (
                <article className="p-3 flex-col space-y-4 text-white bg-gray-900 rounded-xl  w-full lg:w-2/3">
                    <SimpleDialogContainer />
                    <PostHeader post={post} postsAmount={postsAmount} />
                    <main>
                        <div>
                            {imageLoaded || (
                                <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
                                    <Blurhash
                                        width="100%"
                                        height={"100%"}
                                        hash={post.blurHash}
                                    />
                                </div>
                            )}
                            <img
                                onLoad={() => {
                                    setImageLoaded(true);
                                }}
                                className={
                                    imageLoaded
                                        ? "w-full aspect-[4/3] rounded-xl"
                                        : "w-0 h-0"
                                }
                                src={`http://192.168.0.124:8000/storage/${post.image}`}
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
