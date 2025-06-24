import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { responseObject } from "@/lib/responseObject";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions)
    
    if(!session || !session.user){
        return responseObject(false, "Not authenticated", 401)
    }

    const userId = new mongoose.Types.ObjectId(session.user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId }},
            { $unwind: '$messages' },
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: "$_id", messages: {$push: '$messages'}} }
        ])

        if(!user || user.length === 0){
            return responseObject(false, "Messages not found", 404)
        }
        console.log(user[0].messages)
        return responseObject(true, "Messages retrieved", 200, null , user[0].messages)
        
    } catch (error) {
        console.log(error)
        return responseObject(false, "Error getting user messages", 500)
    }
    
}