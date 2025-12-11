import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            // Use Admin allow-all client to ensure we can write to 'users' table bypassing RLS
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Upsert user into Supabase 'users' table
            const { error } = await supabase.from('users').upsert({
                email: user.email,
                full_name: user.name,
                avatar_url: user.image,
                // We let supabase handle created_at and id (if new)
            }, { onConflict: 'email' });

            if (error) {
                console.error("Error saving user to Supabase:", error);
                // We allow sign in even if DB sync fails, or we could return false
                return true;
            }

            return true;
        },
        async session({ session }) {
            // You could attach the supabase user ID here if you fetched it
            return session;
        }
    },
    pages: {
        signIn: '/', // Custom login page (landing page)
    },
    secret: process.env.NEXTAUTH_SECRET,
};
