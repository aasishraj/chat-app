"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 cursor-pointer"
        >
            Login with Google
        </button>
    );
}
