"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
            aria-label="Toggle Theme"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
        </button>
    );
}
