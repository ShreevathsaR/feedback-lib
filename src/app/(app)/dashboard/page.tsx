"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { User } from "next-auth";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/Message";
import { ObjectId } from "mongoose";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: ObjectId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const { data: session } = useSession();
  const user: User = session?.user as User;

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      console.log(response.data);
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed fetch message settings", {
        description: axiosError.response?.data.message,
      });
      console.log(
        "Failed fetching isAcceptingMessage status",
        axiosError.response?.data.message
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        console.log(response.data.messages);
        if (refresh) {
          toast.info("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Failed fetch message settings", {
          description: axiosError.response?.data.message,
        });
        console.log(
          "Failed fetching messages",
          axiosError.response?.data.message
        );
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      console.log("Before", acceptMessages);
      const response = await axios.post<ApiResponse>("api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      console.log("After", response.data);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to change switch state", {
        description: axiosError.response?.data.message,
      });
      console.log(
        "Failed to change switch state",
        axiosError.response?.data.message
      );
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/u/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL Copied", {
      description: "Profile URL has been copied to you clipboard",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Please<a href="/sign-in">Login</a>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-4 mr-2 shadow-lg"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
