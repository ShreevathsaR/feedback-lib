"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

const Navbar = () => {
  const session = useSession();

  const user: User = session.data?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        {session.status === "authenticated" ? (
          <div className="flex items-center">
            <h2 className="mr-4">Welcome {user?.username}!</h2>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Sign out <LogOut />
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto ">
              Login <LogIn />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
