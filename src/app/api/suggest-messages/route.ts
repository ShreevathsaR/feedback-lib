import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { responseObject } from "@/lib/responseObject";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export async function GET() {

  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt
    });

    if (!response.text) {
      return responseObject(false, "Message not generated", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message generated",
        text: response.text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return responseObject(false, "Error generating message", 500);
  }
}
