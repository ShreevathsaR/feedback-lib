import dbConnect from "@/lib/dbConnect";
import { responseObject } from "@/lib/responseObject";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";
import { Message } from "@/model/Message";

export async function POST(req: NextRequest){
    await dbConnect();

    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return responseObject(false, "User not found", 404)
        }

        if(!user.isAcceptingMessage){
            return responseObject(false, "User is not accepting message at the moment", 403)
        }

        const messageObject: Message = {content, createdAt: new Date()} as Message

        user.messages.push(messageObject)
        await user.save();

        return responseObject(true, "Message sent successfully", 201)

    } catch (error) {
        console.log(error)
        return responseObject(false, "Error posting message", 500)
    }
}