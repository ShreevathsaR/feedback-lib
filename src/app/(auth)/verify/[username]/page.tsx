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
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyCode = () => {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    const { code } = data;

    console.log(username, code);

    try {
      setIsVerifying(true);
      const response = await axios.post("/api/verify-code", {
        username,
        code,
      });
      toast.success("Success", {
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification failed", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your code
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center w-full">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Your 6 digit code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCode;
