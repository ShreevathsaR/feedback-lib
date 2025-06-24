import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    const result = usernameValidation.safeParse(username);

    if (!result.success) {
      const nameError = result.error.format()._errors;
      return NextResponse.json({
        success: false,
        message: nameError.length > 0 ? nameError.join(",") : "Invalid name",
      }, { status: 400 });
    }

    const userExists = await UserModel.findOne({ username });

    if (userExists) {
      return NextResponse.json({
        success: false,
        message: "Username already taken",
      }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username available",
      },
      { status: 201 }
    );
  } catch (error){
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: "Error validating username"
      },
      { status: 500 }
    );
  }
}
