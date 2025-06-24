"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Page = () => {
  const { username } = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data.message);
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGeneratedMessages = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get("/api/suggest-messages");

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      setGeneratedMessages(response.data.text.split("||"));
      console.log(response.data.text.split("||"));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data.message);
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-w-screen min-h-screen items-center p-20">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Public Profile Link
      </h1>
      <p>Send an anonymous message to @{username}</p>
      <div className="w-[80%] flex flex-col justify-center mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="max-h-30 shadow-md"
                      placeholder="Your message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Separator className="my-10" />
      <div className="w-full">
        <Button disabled={isGenerating} className="w-content" onClick={()=>getGeneratedMessages()}>{isGenerating ? <>Generating <Loader2 className="animate-spin"/></> : 'Suggest Messages'}</Button>
        <h2 className="text-lg mt-5">AI Generated Messages</h2>
        <div className="mt-10 flex flex-col shadow-lg min-w-full rounded gap-5 p-5">
          {generatedMessages.length > 0 ? (
            generatedMessages.map((message, index) => <p className="p-5 text-center rounded shadow-lg hover:cursor-pointer hover:bg-black/10 border" key={index} onClick={()=> form.setValue('content', message)}>{message}</p>)
          ) : (
            <p className="p-5 text-center">No messages</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
