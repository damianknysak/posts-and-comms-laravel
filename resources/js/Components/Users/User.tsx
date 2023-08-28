import { UserProps } from "@/Interfaces/UserPage";
import { PageProps } from "@/types";
import moment from "moment";
import "moment/dist/locale/pl";
import { Link, router } from "@inertiajs/react";
import { FaLink } from "react-icons/fa";
import { useEffect, useState } from "react";
import EditUserModal from "./EditUserModal";
import axios from "axios";
import { toast } from "react-toastify";
import { SimpleDialogContainer, simpleConfirm } from "react-simple-dialogs";
import UserImage from "./UserImage";

export default function User({ user }: PageProps<{ user: UserProps }>) {
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
            const response = await axios.delete(`/users/delete/${user.id}`);

            if (response.status >= 200 && response.status < 300) {
                router.reload({ only: ["users"] });
                toast("Usunięto użytkownika!", { type: "success" });
            }
        } catch (e) {
            toast("Błąd przy usuwaniu użytkownika!", { type: "error" });
            console.error(e);
        }
    };

    const deleteConfirmation = async () => {
        if (
            await simpleConfirm(
                "Czy jesteś pewien, że chcesz usunąć użytkownika?"
            )
        ) {
            handleDelete();
        }
    };

    return (
        <div className="bg-gray-400 p-3 rounded-xl w-full max-w-lg">
            <SimpleDialogContainer />
            <header className="relative max-h-32 flex flex-col items-center">
                <UserImage
                    imageUrl={user.profileImage}
                    imageHash={user.blurHash}
                    width={80}
                    height={80}
                />
                <p className="text-lg">{user.name}</p>
                <p className="text-sm">{user.email}</p>
                <div className="absolute top-3 right-3 space-x-2">
                    <span
                        onClick={() => {
                            setEditModalActive(true);
                        }}
                        className="text-sm font-semibold cursor-pointer"
                    >
                        Edytuj
                    </span>
                    <span
                        onClick={() => {
                            deleteConfirmation();
                        }}
                        className="text-sm font-semibold text-red-500 cursor-pointer"
                    >
                        Usuń
                    </span>
                </div>
            </header>
            <main className="flex flex-col border-t border-gray-500 mt-2 pt-2">
                <span>
                    <span className="font-semibold">Data urodzenia:</span>{" "}
                    {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "nie podano"}
                </span>

                <span>
                    <span className="font-semibold">
                        Weryfikacja użytkownika:
                    </span>{" "}
                    {user.emailVerifiedAt
                        ? moment(user.emailVerifiedAt).fromNow().toString()
                        : "brak"}
                </span>
                <span>
                    <span className="font-semibold">Dołączono:</span>{" "}
                    {moment(user.createdAt).fromNow().toString()}
                </span>
                <span>
                    <span className="font-semibold">
                        Ostatnia aktualizacja profilu:
                    </span>{" "}
                    {moment(user.updatedAt).fromNow().toString()}
                </span>
                <span>
                    <span className="font-semibold">Liczba postów:</span>{" "}
                    {user.postsAmount}
                </span>
                {user.postsAmount > 0 && (
                    <Link className="" href={user.postsRoute}>
                        <div className="flex underline flex-row space-x-2 items-center">
                            <span>Zobacz posty użytkownika</span>
                            <FaLink />
                        </div>
                    </Link>
                )}

                <span>
                    <span className="font-semibold">Liczba komentarzy:</span>{" "}
                    {user.commentsAmount}
                </span>
                {user.commentsAmount > 0 && (
                    <Link className="" href={user.commentsRoute}>
                        <div className="flex underline flex-row space-x-2 items-center">
                            <span>Zobacz komentarze użytkownika</span>
                            <FaLink />
                        </div>
                    </Link>
                )}
            </main>
            {isEditModalActive && (
                <EditUserModal user={user} setActive={setEditModalActive} />
            )}
        </div>
    );
}
