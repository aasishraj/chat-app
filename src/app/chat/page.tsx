import { ChatStream } from "@/components/ChatStream";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-black">
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
                <h1 className="text-xl font-bold">Chat Away</h1>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <LogoutButton />
                    {session.user?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={session.user.image}
                            alt={`Avatar of ${session.user.name}`}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                <ChatStream />
            </main>
        </div>
    );
}
