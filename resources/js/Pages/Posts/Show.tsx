import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import Post from "@/Components/Posts/Post";
import { PostProps } from "@/Interfaces/PostProps";
import { useEffect, useRef } from "react";
import { CommentsPage } from "@/Interfaces/CommentPage";
import Comment from "@/Components/Comments/Comment";
import PageNavigation from "@/Components/Shared/PageNavigation";

interface SinglePagePost {
    data: PostProps;
}

export default function Show(
    this: any,
    {
        auth,
        comments,
        post,
        token,
    }: PageProps<{
        post: SinglePagePost;
        comments: CommentsPage;
        token: string;
    }>
) {
    const hereRef = useRef<HTMLDivElement | null>(null); // Utwórz referencję

    useEffect(() => {
        if (hereRef.current) {
            hereRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-400 leading-tight">
                    Post
                </h2>
            }
        >
            <Head title="Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div
                            ref={hereRef}
                            className="p-6 space-y-2 flex flex-col items-center"
                        >
                            <Post
                                key={post.data.id}
                                auth={{
                                    user: auth.user,
                                }}
                                post={post.data}
                                postsAmount={1}
                            />
                        </div>
                        <div className="flex flex-1 justify-center">
                            <div className="w-full lg:w-2/3 max-w-7xl px-6 space-y-2">
                                {comments.data.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        auth={{
                                            user: auth.user,
                                        }}
                                        comment={comment}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center my-2">
                            <PageNavigation
                                links={comments.links}
                                meta={comments.meta}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
