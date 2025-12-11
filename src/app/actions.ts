"use server";

// We use the direct supabase-js client for Admin access to bypass RLS for inserts
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function sendMessage(content: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("User not authenticated");
    }

    // Initialize Supabase Admin Client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("messages").insert({
        content,
        user_email: session.user.email,
    });

    if (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }

    return { success: true };
}
