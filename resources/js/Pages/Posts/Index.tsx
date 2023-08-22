import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import Post from "@/Components/Posts/Post";
import { PostsPage } from "@/Interfaces/PostPage";
import PageNavigation from "@/Components/Shared/PageNavigation";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AddPostModal from "@/Components/Posts/AddPostModal";

export default function Index({
    auth,
    posts,
}: PageProps<{ posts: PostsPage }>) {
    const [isAddModalActive, setIsAddModalActive] = useState(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between ">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-400 leading-tight">
                        <span>Posts</span>
                    </h2>
                    <div
                        onClick={() => {
                            setIsAddModalActive(true);
                        }}
                        className="border border-white cursor-pointer flex space-x-2 items-center bg-black p-3 rounded-full"
                    >
                        <span className="text-white font-semibold">
                            Dodaj post
                        </span>
                        <FaPlusCircle className="text-white" />
                    </div>
                </div>
            }
        >
            <Head title="Posts" />

            <div className="py-12">
                {isAddModalActive && (
                    <AddPostModal setActive={setIsAddModalActive} />
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-2 flex flex-col items-center">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex w-full items-center justify-center"
                                    id={`${post.id}`}
                                >
                                    <Post
                                        key={post.id}
                                        auth={{
                                            user: auth.user,
                                        }}
                                        post={post}
                                        postsAmount={posts.data.length}
                                    />
                                </div>
                            ))}

                            {(posts.links.next || posts.links.prev) && (
                                <PageNavigation
                                    meta={posts.meta}
                                    links={posts.links}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
