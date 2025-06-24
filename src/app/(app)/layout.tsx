import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Anonymous Feedback | Dive into the World of Anonymous Feedback",
  description: "Dive into the World of Anonymous Feedback",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  );
}
