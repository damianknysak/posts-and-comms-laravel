import { PostProps } from "@/Interfaces/PostProps";
import { PageProps } from "@/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    FaFileImage,
    FaHeart,
    FaLaughBeam,
    FaSadCry,
    FaThumbsUp,
    FaTimes,
} from "react-icons/fa";
import moment from "moment";
import "moment/locale/pl";
import axios from "axios";
import { Link, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostBottomSection from "./PostBottomSection";

interface EditPostModalProps {
    setActive: Dispatch<SetStateAction<boolean>>;
    post: PostProps;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ setActive, post }) => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        setTitle(post.title);
        setSlug(post.slug);
        // setImage(post.image);
    }, []);

    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setImageUrl(reader.result);
                }
            };
            reader.readAsDataURL(selectedImage);
        }
    }, [selectedImage]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("slug", slug);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await axios.post(
                `/posts/edit/${post.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast("Edytowano post!", { type: "success" });
        } catch (error) {
            toast("Błąd przy edycji postu", { type: "error" });
        }
    };

    function getFileInfo(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setSelectedImage(selectedFile);
        }
    }

    return (
        <div
            style={{ top: scrollY, bottom: -scrollY }}
            className={`absolute left-0 right-0 flex flex-col items-center justify-center bg-black/70`}
        >
            <div
                className="absolute flex  items-center justify-center top-10 right-10 w-10 h-10 rounded-full bg-gray-800 cursor-pointer"
                onClick={() => {
                    router.reload({ only: ["posts"] });
                    setActive(false);
                }}
            >
                <FaTimes className="w-7 h-7" />
            </div>
            <p className="p-3 rounded-t-xl font-semibold text-2xl bg-gray-800">
                Edytujesz post
            </p>
            <article className="p-3 max-w-xl w-full flex-col space-y-4 text-white bg-gray-900 rounded-xl">
                <div className="flex flex-col justify-between mx-3">
                    <div className="flex flex-row space-x-2">
                        <img
                            className="w-10 h-10 bg-red-200 rounded-full"
                            src={`http://localhost:8000/storage/${post.authorImage}`}
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold">
                                {post.author}{" "}
                            </span>

                            <span className="text-sm">
                                {moment(post.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col mt-2 space-y-2">
                        <p className="text-xs font-semibold ">Edytuj tytuł</p>
                        <input
                            className="bg-gray-900 w-full rounded-xl"
                            type="text"
                            value={title}
                            onChange={(text) => {
                                setTitle(text.currentTarget.value);
                            }}
                        />
                        <p className="text-xs font-semibold ">Edytuj slug</p>
                        <input
                            className="bg-gray-900 w-full rounded-xl"
                            type="text"
                            value={slug}
                            onChange={(text) => {
                                setSlug(text.currentTarget.value);
                            }}
                        />
                    </div>
                </div>
                <main>
                    <div className="relative">
                        <div className="absolute top-5 right-5 bg-black/75 p-3 rounded-xl">
                            <input
                                accept="image/*"
                                type="file"
                                onChange={getFileInfo}
                            />
                        </div>
                        <img
                            className="w-full rounded-xl"
                            src={
                                !imageUrl
                                    ? `http://localhost:8000/storage/${post.image}`
                                    : imageUrl
                            }
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
            <div
                onClick={handleSubmit}
                className="bg-black border-2 border-gray-800 p-3 rounded-xl mt-1 cursor-pointer"
            >
                <p className="text-xl font-semibold">Zapisz zmiany</p>
            </div>
        </div>
    );
};

export default EditPostModal;
