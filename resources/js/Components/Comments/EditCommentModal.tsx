import { CommentProps } from "@/Interfaces/CommentPage";
import { router } from "@inertiajs/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import "moment/dist/locale/pl";
import axios from "axios";
import { toast } from "react-toastify";
const EditCommentModal: React.FC<{
    comment: CommentProps;
    setActive: Dispatch<SetStateAction<boolean>>;
}> = ({ setActive, comment }) => {
    const [editedComment, setEditedComment] = useState("");

    useEffect(() => {
        setEditedComment(comment.comment);
    }, []);
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("comment", editedComment);
            formData.append("authorId", comment.authorId.toString());

            const response = await axios.post(
                `/comments/edit/${comment.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast("Edytowano komentarz!", { type: "success" });
        } catch (error) {
            toast("Błąd przy edycji komentarza", { type: "error" });
        }
    };

    return (
        <div
            style={{ top: scrollY, bottom: -scrollY }}
            className={`absolute left-0 right-0 flex flex-col items-center justify-center bg-black/70`}
        >
            <div
                className="absolute flex  items-center justify-center top-10 right-10 w-10 h-10 rounded-full bg-gray-800 cursor-pointer"
                onClick={() => {
                    router.reload({ only: ["comments"] });
                    setActive(false);
                }}
            >
                <FaTimes className="w-7 h-7 text-white" />
            </div>
            <p className="p-3 text-white rounded-t-xl font-semibold text-2xl bg-gray-800">
                Edytujesz komentarz
            </p>
            <div className="max-w-xl w-full flex flex-col  bg-gray-400 p-5 rounded-xl">
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
                <p className="text-xs text-gray-800">
                    Edytuj zawartość komentarza
                </p>
                <textarea
                    rows={15}
                    className="p-3 mt-1 rounded"
                    onChange={(text) => {
                        setEditedComment(text.currentTarget.value);
                    }}
                    value={editedComment}
                />
            </div>
            <div
                onClick={handleSubmit}
                className="bg-black border-2 border-gray-800 p-3 rounded-xl mt-1 cursor-pointer"
            >
                <p className="text-xl text-white font-semibold">
                    Zapisz zmiany
                </p>
            </div>
        </div>
    );
};

export default EditCommentModal;
