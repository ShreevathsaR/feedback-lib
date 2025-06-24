import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { responseObject } from "@/lib/responseObject";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import { signIn } from "next-auth/react";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: any } }
) {
  const messageId = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return responseObject(false, "Not authenticated", 401);
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount == 0) {
      return responseObject(false, "Message not found or already deleted", 404);
    }

    return responseObject(true, "Message deleted successfully", 200)
  } catch (error) {
    console.log(error);
    return responseObject(false, "Error deleting messages", 500);
  }
}
