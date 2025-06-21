import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Middleware token", req.nextauth.token);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        console.log("Token in callback", token)

        if (
          pathname.startsWith("/api/auth") ||
          pathname == "/sign-in" ||
          pathname == "/sign-up" ||
          pathname == "/"
        ) {
          return true;
        }

        //if(token) return token
        return !!token
      },
    }
  }
);

export const config = { matcher: ["/dashboard"] };
