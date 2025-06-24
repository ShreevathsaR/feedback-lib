import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Message } from "@/model/Message";
import { ApiResponse } from "@/types/apiResponse";
import { ObjectId } from "mongoose";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: ObjectId) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success("Deleted successfully", {
        description: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>
          {new Date(message.createdAt).toLocaleString("en-In")}
        </CardDescription>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-8 h-8" variant={"destructive"}>
              <DeleteIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
