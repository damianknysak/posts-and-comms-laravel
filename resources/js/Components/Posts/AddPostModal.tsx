import { router } from "@inertiajs/react";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const AddPostModal: React.FC<{
    setActive: Dispatch<SetStateAction<boolean>>;
}> = ({ setActive }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(true);

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

            const response = await axios.post(`/posts/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast("Dodano post!", { type: "success" });
        } catch (error) {
            toast("Błąd przy dodawaniu posta", { type: "error" });
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
                <FaTimes className="w-7 h-7 text-white" />
            </div>
            <p className="p-3 text-white rounded-t-xl font-semibold text-2xl bg-gray-800">
                Dodajesz post
            </p>
            <article className="p-3 max-w-xl w-full flex-col space-y-4 text-white bg-gray-900 rounded-xl">
                {!areAllFieldsFilled && (
                    <div className="flex items-center space-x-2">
                        <FaExclamationCircle className="text-red-500" />
                        <p className="text-red-500 font-semibold ">
                            Wypełnij wszystkie pola
                        </p>
                    </div>
                )}
                <p className="text-xs font-semibold ">Wpisz tytuł</p>
                <input
                    className="bg-gray-900 w-full rounded-xl"
                    type="text"
                    value={title}
                    onChange={(text) => {
                        setTitle(text.currentTarget.value);
                    }}
                />
                <p className="text-xs font-semibold ">Wpisz slug</p>
                <input
                    className="bg-gray-900 w-full rounded-xl"
                    type="text"
                    value={slug}
                    onChange={(text) => {
                        setSlug(text.currentTarget.value);
                    }}
                />
                <p className="text-xs font-semibold ">Wybierz zdjęcie</p>
                <div className="bg-black/75 p-3 rounded-xl">
                    <input
                        accept="image/*"
                        type="file"
                        onChange={getFileInfo}
                    />
                </div>
                <div className="flex justify-center">
                    {imageUrl && (
                        <img className="rounded-xl max-h-72" src={imageUrl} />
                    )}
                </div>
            </article>
            <div
                onClick={() => {
                    if (title && slug && selectedImage) {
                        setAreAllFieldsFilled(true);
                        handleSubmit();
                    } else {
                        setAreAllFieldsFilled(false);
                    }
                }}
                className="bg-black border-2 border-gray-800 p-3 rounded-xl mt-1 cursor-pointer"
            >
                <p className="text-xl font-semibold text-white">
                    Zapisz zmiany
                </p>
            </div>
        </div>
    );
};

export default AddPostModal;
