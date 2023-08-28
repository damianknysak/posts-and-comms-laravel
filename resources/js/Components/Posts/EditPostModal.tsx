import { PostProps } from "@/Interfaces/PostProps";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import "moment/locale/pl";
import axios from "axios";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostBottomSection from "./PostBottomSection";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { convertDataUrlToBlob } from "@/utils/CropUtils";
interface EditPostModalProps {
    setActive: Dispatch<SetStateAction<boolean>>;
    post: PostProps;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ setActive, post }) => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState<any>();
    useEffect(() => {
        setTitle(post.title);
        setSlug(post.slug);
    }, []);

    useEffect(() => {
        if (cropData != "#") {
            setImageUrl(cropData);
            setImage("");
        }
    }, [cropData]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("slug", slug);

            if (cropData != "#") {
                const file = new File(
                    [convertDataUrlToBlob(cropData)],
                    "output.jpg",
                    { type: `image/jpeg` }
                );
                formData.append("image", file);
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
            console.error(error);
            toast("Błąd przy edycji postu", { type: "error" });
        }
    };

    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);

        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setSelectedImage(selectedFile);
        }
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
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
                            src={`http://192.168.0.124:8000/storage/${post.authorImage}`}
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
                        {image != "" && (
                            <div
                                className="absolute top-5 left-5 cursor-pointer bg-black p-3 border-2 border-gray-700 rounded-xl z-50"
                                onClick={getCropData}
                            >
                                Przytnij
                            </div>
                        )}

                        <div className="absolute top-5 right-5 bg-black/75 p-3 rounded-xl z-50">
                            <input type="file" onChange={onChange} />
                        </div>
                        <div className="relative w-full aspect-[4/3] bg-red-100 rounded-xl overflow-hidden">
                            {image == "" ? (
                                <img
                                    className="w-full h-full"
                                    src={
                                        !imageUrl
                                            ? `http://192.168.0.124:8000/storage/${post.image}`
                                            : imageUrl
                                    }
                                />
                            ) : (
                                <div className="w-full h-full">
                                    <Cropper
                                        className="w-full h-full"
                                        viewMode={3}
                                        aspectRatio={4 / 3}
                                        src={image}
                                        background={false}
                                        responsive={true}
                                        onInitialized={(instance: any) => {
                                            setCropper(instance);
                                        }}
                                        zoomable={false}
                                    />
                                </div>
                            )}
                        </div>
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
