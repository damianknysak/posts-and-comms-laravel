import { Head } from "@inertiajs/react";
import React from "react";

function EmailVerifiedConfirmation() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-400">
            <Head title="Email Verified" />
            <div className="bg-white dark:bg-gray-900 rounded">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    Twój email został zweryfikowany!
                </div>
            </div>
        </div>
    );
}

export default EmailVerifiedConfirmation;
