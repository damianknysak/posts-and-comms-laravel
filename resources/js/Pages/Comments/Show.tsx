import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import NavLink from "@/Components/NavLink";
import { CommentProps, CommentsPage } from "@/Interfaces/CommentPage";
import Comment from "@/Components/Comments/Comment";
import PageNavigation from "@/Components/Shared/PageNavigation";

interface SinglePageComment {
    data: CommentProps;
}

export default function Index({
    auth,
    comment,
}: PageProps<{ comment: SinglePageComment }>) {
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
                            <Comment
                                key={comment.data.id}
                                auth={{
                                    user: auth.user,
                                }}
                                comment={comment.data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
