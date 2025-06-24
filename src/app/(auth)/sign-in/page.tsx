"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Failed logging in", {
          description: response.error,
        });
        return;
      }

      toast.success("Success", {
        description: "Login successful",
      });
      router.replace(`/dashboard`);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed logging in", {
        description: error instanceof Error ? error.message : "An unexpected error. Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login to Feedback Lib
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Username or Email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-center">
            Not registered? Please{" "}
            <a className="text-blue-700 underline" href="/sign-up">
              Register
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;
