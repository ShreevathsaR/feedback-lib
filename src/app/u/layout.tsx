import { Metadata } from "next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}

export const metadata: Metadata = {
  title: "Send Anonymous Message | Anonymous Feedback",
  description: "Send messages to a user anonymously",
};
