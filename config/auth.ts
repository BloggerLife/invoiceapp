import { AuthOptions, NextAuthOptions } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/prisma/db";

// more providers at https://next-auth.js.org/providers
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_SECRET || "",
    //   profile(profile) {
    //     const nameParts = (profile.name || profile.login || "").split(" ");
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name || profile.login,
    //       firstName: nameParts[0] || "GitHub", // Fallback
    //       lastName: nameParts[1] || "User", // Fallback
    //       phone: `github_${profile.id}`, // Generate unique identifier
    //       image: profile.avatar_url,
    //       email: profile.email,
    //       role: "USER",
    //       invoiceCount: 0,
    //     };
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          firstName: profile.given_name || "Google",
          lastName: profile.family_name || "User",
          phone: `google_${profile.sub}`, // Generate unique identifier
          role: "USER",
          image: profile.picture,
          email: profile.email,
          invoiceCount: 0,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow credential logins to pass through
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers (Google, GitHub)
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        try {
          // Check if user exists with this email
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });

          // If user exists but no account for this provider
          if (
            existingUser &&
            !existingUser.accounts.some(
              (acc) => acc.provider === account.provider,
            )
          ) {
            // Link this account to the existing user
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            return true;
          }

          // User exists and already has this provider account
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // console.log("JWT callback - initial token:", token);
      // console.log("JWT callback - user:", user);

      // If this is a sign-in or update, fetch the latest user data
      if (user || trigger === "update") {
        // Fetch the complete user data from the database including subscription
        const dbUser = await db.user.findUnique({
          where: { email: (user?.email || token.email) as string },
          include: {
            subscription: true,
          },
        });

        console.log("JWT callback - dbUser:", dbUser);

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.phone = dbUser.phone;
          token.invoiceCount = dbUser.invoiceCount;

          // Add subscription information to token
          if (dbUser.subscription) {
            token.subscription = {
              id: dbUser.subscription.id,
              plan: dbUser.subscription.plan,
              status: dbUser.subscription.status,
              currentPeriodStart:
                dbUser.subscription.currentPeriodStart?.toISOString(),
              currentPeriodEnd:
                dbUser.subscription.currentPeriodEnd?.toISOString(),
              cancelAtPeriodEnd: dbUser.subscription.cancelAtPeriodEnd,
              priceAmount: dbUser.subscription.priceAmount,
              priceCurrency: dbUser.subscription.priceCurrency,
              interval: dbUser.subscription.interval,
            };
          } else {
            // Default to FREE plan if no subscription exists
            token.subscription = null;
          }
        } else {
          console.error(
            "User not found in database:",
            user?.email || token.email,
          );
        }
      }

      // console.log("JWT callback - final token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.invoiceCount = token.invoiceCount as number;

        // Add subscription to session
        session.user.subscription = token.subscription as {
          id: string | null;
          plan: "FREE" | "MONTHLY" | "YEARLY";
          status: string;
          currentPeriodStart: string | null;
          currentPeriodEnd: string | null;
          cancelAtPeriodEnd: boolean;
          priceAmount: number | null;
          priceCurrency: string;
          interval: string | null;
        } | null;
      }
      return session;
    },
  },
};
