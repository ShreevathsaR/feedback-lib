import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import { responseObject } from "@/lib/responseObject";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions); //session will only be retrieved only if this request was made from the same domain where the user logs in

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;
  const { acceptMessage } = await req.json();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userObjectId,
      {
        isAcceptingMessage: acceptMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return responseObject(true, "User message accepting status updated", 201, updatedUser.isAcceptingMessage); //the start of using reusable response obj
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed updating status",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions); //session will only be retrieved only if this request was made from the same domain where the user logs in

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return responseObject(false, "User not found", 404);
    }

    return responseObject(true, "User status retrived", 200, user.isAcceptingMessage);

  } catch (error) {
    console.log(error)
    return responseObject(false, "Error retrieving status", 500)
  }
}
