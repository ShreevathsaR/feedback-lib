import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    console.log({ username, code });

    const result = verifySchema.safeParse({ code: decodeURIComponent(code) });

    if (!result.success) {
      const codeError = result.error.format().code?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: codeError?.length > 0 ? codeError?.join(",") : [],
        },
        { status: 500 }
      );
    }

    const usernameResult = usernameValidation.safeParse(
      decodeURIComponent(username)
    );

    if (!usernameResult.success) {
      const nameError = usernameResult.error.format()._errors;
      return NextResponse.json(
        {
          success: false,
          message: nameError.length > 0 ? nameError.join(",") : "Invalid name",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      username: decodeURIComponent(username),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = decodeURIComponent(code) === user.verifyCode;
    const isCodeExpired = new Date() > new Date(user.verifyCodeExpiry);

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "User is verified",
        },
        { status: 200 }
      );
    } else if (isCodeExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code is expired",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 }
    );
  }
}
