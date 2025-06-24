import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    //check for unique username
    const userVerificationUsingName = await UserModel.findOne({
      username,
    });

    if (userVerificationUsingName) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    //check for existing user email
    const userVerificationUsingEmail = await UserModel.findOne({ email });

    console.log("User via email", userVerificationUsingEmail)

    if (userVerificationUsingEmail) {
      if (userVerificationUsingEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User email is already registered",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

        userVerificationUsingEmail.username = username
        userVerificationUsingEmail.password = hashedPassword;
        userVerificationUsingEmail.verifyCode = verifyCode;
        userVerificationUsingEmail.verifyCodeExpiry = verifyCodeExpiry;

        userVerificationUsingEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: emailResponse.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User registration failed", error);
    return NextResponse.json(
      { success: false, message: "User registration failed" },
      { status: 500 }
    );
  }
}
