import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import NavLink from "@/Components/NavLink";
import { UsersPage } from "@/Interfaces/UserPage";
import User from "@/Components/Users/User";
import PageNavigation from "@/Components/Shared/PageNavigation";
import { useEffect } from "react";

export default function Index({
    auth,
    users,
}: PageProps<{ users: UsersPage }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-400 leading-tight">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-2 flex flex-col items-center">
                            {users.data.map((user) => (
                                <User
                                    key={user.id}
                                    auth={{
                                        user: auth.user,
                                    }}
                                    user={user}
                                />
                            ))}
                            {(users.links.next || users.links.prev) && (
                                <PageNavigation
                                    meta={users.meta}
                                    links={users.links}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
