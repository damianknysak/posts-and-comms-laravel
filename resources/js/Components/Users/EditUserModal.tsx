import { UserProps } from "@/Interfaces/UserPage";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import moment from "moment";
import "moment/dist/locale/pl";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

const EditUserModal: React.FC<{
    setActive: Dispatch<SetStateAction<boolean>>;
    user: UserProps;
}> = ({ setActive, user }) => {
    const [editedName, setEditedName] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        setEditedName(user.name);
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

    function getFileInfo(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setSelectedImage(selectedFile);
        }
    }

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editedName);
            if (selectedImage) {
                formData.append("profile_image", selectedImage);
            }

            const response = await axios.post(
                `/users/edit/${user.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.status);
            toast("Edytowano użytkownika!", { type: "success" });
        } catch (error) {
            toast("Błąd przy edycji postu", { type: "error" });
        }
    };

    return (
        <div
            style={{ top: scrollY, bottom: -scrollY }}
            className={`absolute left-0 right-0 flex flex-col items-center z-10 justify-center bg-black/70`}
        >
            <div
                className="absolute flex  items-center justify-center top-10 right-10 w-10 h-10 rounded-full bg-gray-800 cursor-pointer"
                onClick={() => {
                    router.reload({ only: ["users"] });
                    setActive(false);
                }}
            >
                <FaTimes className="w-7 h-7 text-white" />
            </div>

            <p className="p-3 text-white rounded-t-xl font-semibold text-2xl bg-gray-800">
                Edytujesz użytkownika
            </p>
            <div className="max-w-xl w-full flex items-center flex-col space-y-2  bg-gray-400 p-5 rounded-xl">
                <p className="text-sm font-semibold">Zmień zdjęcie profilowe</p>

                <div className="relative">
                    <img
                        className="w-32 h-32 bg-black/75 rounded-full object-contain"
                        src={
                            imageUrl
                                ? imageUrl
                                : `http://192.168.0.124:8000/storage/${user.profileImage}`
                        }
                    />
                </div>
                <div className="pt-2 space-y-1">
                    <input
                        className="bg-gray-800 text-white rounded"
                        accept="image/*"
                        type="file"
                        onChange={getFileInfo}
                    />
                    <p className="text-sm font-semibold text-center">
                        Zmień Imię i Nazwisko
                    </p>
                    <input
                        className="border-none rounded-xl bg-red"
                        type="text"
                        value={editedName}
                        onChange={(e) => {
                            setEditedName(e.target.value);
                        }}
                    />
                </div>
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

export default EditUserModal;
