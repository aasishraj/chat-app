"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/app/actions";
import { useSession } from "next-auth/react";

type Message = {
    id: number;
    content: string;
    user_email: string;
    created_at: string;
    user_full_name?: string;
};

export function ChatStream() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const { data: session } = useSession();
    const bottomRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        // Fetch initial messages with user details
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("*, users(full_name)")
                .order("created_at", { ascending: true });

            if (data) {
                // Flatten the structure for easier usage
                const formattedMessages = data.map((msg: any) => ({
                    ...msg,
                    user_full_name: msg.users?.full_name,
                }));
                setMessages(formattedMessages);
            }
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel("realtime messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                async (payload) => {
                    const newMessage = payload.new as Message;

                    // Fetch user details for the new message
                    // We optimistically assume email has a match, or fallback to email
                    const { data: userData } = await supabase
                        .from('users')
                        .select('full_name')
                        .eq('email', newMessage.user_email)
                        .single();

                    const messageWithUser = {
                        ...newMessage,
                        user_full_name: userData?.full_name
                    };

                    setMessages((prev) => [...prev, messageWithUser]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput(""); // Optimistic clear

        try {
            await sendMessage(content);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ul
                className="flex-1 overflow-y-auto p-4 space-y-4"
                role="log"
                aria-live="polite"
                aria-label="Chat History"
            >
                {messages.map((msg) => {
                    const isMe = msg.user_email === session?.user?.email;
                    const displayName = msg.user_full_name || msg.user_email;

                    return (
                        <li
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isMe
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white"
                                    }`}
                            >
                                {!isMe && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {displayName}
                                    </p>
                                )}
                                <p>{msg.content}</p>
                            </div>
                        </li>
                    );
                })}
                <div ref={bottomRef} />
            </ul>
            <form
                onSubmit={handleSubmit}
                className="border-t border-gray-200 dark:border-zinc-800 p-4 bg-white dark:bg-black"
                aria-label="New Message Form"
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        aria-label="Type a message"
                        className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        aria-label="Send message"
                        className="rounded-full bg-black dark:bg-white px-6 py-2 font-semibold text-white dark:text-black transition-opacity hover:opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-black cursor-pointer disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
