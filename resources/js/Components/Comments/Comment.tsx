import { CommentProps } from "@/Interfaces/CommentPage";
import { PageProps } from "@/types";
import { Link, router } from "@inertiajs/react";
import moment from "moment";
import "moment/dist/locale/pl";
import { useEffect, useState } from "react";
import EditCommentModal from "./EditCommentModal";
import axios from "axios";
import { toast } from "react-toastify";
import { SimpleDialogContainer, simpleConfirm } from "react-simple-dialogs";

export default function Comment({
    comment,
}: PageProps<{ comment: CommentProps }>) {
    const [isEditModalActive, setEditModalActive] = useState(false);

    useEffect(() => {
        if (isEditModalActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isEditModalActive]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `/comments/delete/${comment.id}`
            );

            if (response.status >= 200 && response.status < 300) {
                router.reload({ only: ["comments", "post"] });
                toast("Usunięto komentarz!", { type: "success" });
            }
        } catch (e) {
            toast("Błąd przy usuwaniu komentarza!", { type: "error" });
            console.error(e);
        }
    };

    const deleteConfirmation = async () => {
        if (
            await simpleConfirm(
                "Czy jesteś pewien, że chcesz usunąć komentarz?"
            )
        ) {
            handleDelete();
        }
    };

    return (
        <div className="bg-gray-400 rounded-xl p-3 w-full">
            <SimpleDialogContainer />

            <div className="flex flex-row justify-center space-x-4 border-b border-gray-500 mb-2">
                <Link href={`/posts?postId[eq]=${comment.postId}`} className="">
                    <span className="text-xs">Zobacz post</span>
                </Link>
                <Link
                    onClick={(e) => {
                        e.preventDefault();
                        setEditModalActive(true);
                    }}
                    href="#"
                    className=""
                >
                    <span className="text-xs">Edytuj</span>
                </Link>
                <Link
                    onClick={(e) => {
                        e.preventDefault();
                        deleteConfirmation();
                    }}
                    href="#"
                    className=""
                >
                    <span className="text-xs text-red-500">Usuń</span>
                </Link>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row space-x-2 items-center">
                        <img
                            className="w-10 h-10 bg-red-200 rounded-full"
                            src={`http://192.168.0.124:8000/storage/${comment.authorImage}`}
                        />
                        <span>{comment.author.name}</span>
                    </div>

                    <span className="text-sm text-gray-800">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className="mt-4">{comment.comment}</p>
            </div>
            {isEditModalActive && (
                <EditCommentModal
                    comment={comment}
                    setActive={setEditModalActive}
                />
            )}
        </div>
    );
}
