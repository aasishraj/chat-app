"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer"
        >
            Sign out
        </button>
    );
}
