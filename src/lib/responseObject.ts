import { NextResponse } from "next/server";

export const responseObject = (
  success: boolean,
  message: string,
  status: number,
  isAcceptingMessage?: boolean | null,
  messages?: any
) => {
  return NextResponse.json(
    {
      success,
      message,
      ...(isAcceptingMessage !== undefined && {isAcceptingMessage}), 
      ...(messages !== undefined && {messages}) 
    },
    { status }
  );
};
