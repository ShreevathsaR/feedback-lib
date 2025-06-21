import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log("Entering....")

        if (!credentials.email || !credentials.password) {
          throw new Error("Please provide the required parameters");
        }

        try {
          // const user = await UserModel.findOne({ email: credentials.email });
          const user = await UserModel.findOne({ $or:[
            { email: credentials.email },
            { username: credentials.email }
          ] })

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          const isMatching = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isMatching) {
            throw new Error("Wrong credentials");
          }

          console.log('User logged in...')
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessage = token.isAcceptingMessage
        session.user.username = token.username
      }
      return session;
    },
    async jwt({ token, user}) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },
  pages:{
    signIn:"/sign-in",
    error:"/sign-in"
  },
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
