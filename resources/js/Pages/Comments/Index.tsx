import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { CommentsPage } from "@/Interfaces/CommentPage";
import Comment from "@/Components/Comments/Comment";
import PageNavigation from "@/Components/Shared/PageNavigation";
import { useEffect } from "react";

export default function Index({
    auth,
    comments,
}: PageProps<{ comments: CommentsPage }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-400 leading-tight">
                    Comments
                </h2>
            }
        >
            <Head title="Comments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-2 flex flex-col items-center">
                            {comments.data.map((comment) => (
                                <div key={comment.id} className="w-96">
                                    <Comment
                                        key={comment.id}
                                        auth={{
                                            user: auth.user,
                                        }}
                                        comment={comment}
                                    />
                                </div>
                            ))}

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
