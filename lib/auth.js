import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+password");

        if (!user) throw new Error("No account found with this email");
        if (!user.isActive) throw new Error("This account is disabled");

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!valid) throw new Error("Invalid password");

        // The returned object is persisted into the JWT (jwt callback).
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          gymId: user.gymId ? user.gymId.toString() : null,
          photo: user.photo,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, copy custom fields onto the token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.gymId = user.gymId;
        token.photo = user.photo;
        token.emailVerified = user.emailVerified;
      }
      // Allow client-side session.update() to refresh mutable fields.
      if (trigger === "update" && session) {
        token.photo = session.photo ?? token.photo;
        token.gymId = session.gymId ?? token.gymId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.gymId = token.gymId;
        session.user.photo = token.photo;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
