import React, { ComponentProps, useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/pl";
import { PageProps } from "@/types";
import { PostProps } from "@/Interfaces/PostProps";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, router } from "@inertiajs/react";
import { simpleConfirm } from "react-simple-dialogs";
import EditPostModal from "./EditPostModal";
import { Inertia, Page } from "@inertiajs/inertia";
import { Blurhash } from "react-blurhash";
import UserImage from "../Users/UserImage";

interface PostHeaderProps {
    post: PostProps;
    postsAmount: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, postsAmount }) => {
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
            const response = await axios.delete(`/posts/delete/${post.id}`);

            if (response.status >= 200 && response.status < 300) {
                if (postsAmount > 1) {
                    router.reload({ only: ["posts"] });
                } else {
                    router.visit("/posts", { method: "get" });
                }
                toast("Usunięto post!", { type: "success" });
            }
        } catch (e) {
            toast("Błąd przy usuwaniu posta!", { type: "error" });
            console.error(e);
        }
    };

    const deleteConfirmation = async () => {
        if (await simpleConfirm("Czy jesteś pewien, że chcesz usunąć post?")) {
            handleDelete();
        }
    };
    return (
        <header className="flex flex-col justify-between mx-3">
            <div className="flex justify-between border-b border-gray-500 pb-2 mb-4">
                <Link
                    onClick={(e) => {
                        e.preventDefault();
                        setEditModalActive(true);
                    }}
                    href="#"
                >
                    Edytuj
                </Link>
                <Link
                    onClick={(e) => {
                        e.preventDefault();
                        deleteConfirmation();
                    }}
                    href="#"
                    className="text-red-400"
                >
                    Usuń
                </Link>
            </div>
            <div className="flex flex-row space-x-2">
                <UserImage
                    imageHash={post.authorBlurHash}
                    imageUrl={post.authorImage}
                    width={40}
                    height={40}
                />

                <div className="flex flex-col">
                    <Link href={`/users?id[eq]=${post.authorId}`}>
                        <span className="font-semibold">{post.author} </span>
                    </Link>

                    <span className="text-sm">
                        {moment(post.createdAt).fromNow()}
                    </span>
                </div>
            </div>
            <p className="mt-2">{post.title}</p>
            {isEditModalActive && (
                <EditPostModal setActive={setEditModalActive} post={post} />
            )}
        </header>
    );
};

export default PostHeader;
