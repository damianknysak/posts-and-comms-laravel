import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import Post from "@/Components/Posts/Post";
import { PostProps } from "@/Interfaces/PostProps";
import { useEffect, useRef, useState } from "react";
import { CommentsPage } from "@/Interfaces/CommentPage";
import Comment from "@/Components/Comments/Comment";
import PageNavigation from "@/Components/Shared/PageNavigation";
import { FaRegComment, FaRegCommentAlt } from "react-icons/fa";
import TextInput from "@/Components/TextInput";
import axios from "axios";
import { toast } from "react-toastify";

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
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (hereRef.current) {
            hereRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, []);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("comment", newComment);

            const response = await axios.post(
                `/posts/${post.data.id}/comment`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast("Dodano komentarz!", { type: "success" });
            router.reload({ only: ["comments", "post"] });
            setNewComment("");
        } catch (error) {
            toast("Błąd przy dodawaniu posta", { type: "error" });
        }
    };

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
                            <div className="bg-gray-400 space-x-2 w-full lg:w-2/3 rounded-full flex justify-around items-center py-5">
                                <textarea
                                    value={newComment}
                                    className="rounded-xl w-2/3 bg-gray-400 border-gray-800 border-2"
                                    placeholder="Dodaj komentarz ..."
                                    onChange={(e) => {
                                        setNewComment(e.target.value);
                                    }}
                                />
                                <div
                                    onClick={handleSubmit}
                                    className="bg-gray-800 p-3 flex space-x-2 rounded-xl cursor-pointer shadow-lg shadow-white"
                                >
                                    <span className="text-white text-xs">
                                        Opublikuj
                                    </span>
                                    <FaRegComment className="text-white" />
                                </div>
                            </div>
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
                            {(comments.links.next || comments.links.prev) && (
                                <PageNavigation
                                    meta={comments.meta}
                                    links={comments.links}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
