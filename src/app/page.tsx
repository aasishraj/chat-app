import { LoginButton } from "@/components/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200/50 blur-[100px] dark:bg-zinc-800/50" />

      <main className="flex flex-col items-center gap-8 text-center z-10 max-w-2xl px-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-black dark:text-white">
            Chat Away
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect with friends and chat instantly with real-time messaging.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
