import mongoose, { Document, Model, Schema } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean; 
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required2"],
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: [true, "Email is required2"],
        unique: true,
        match: [ /.+\@.+\..+/ , 'Please use a valid email address2']
    },
    password:{
        type: String,
        required: [true, "Password is required2"]
    },
    verifyCode:{
        type: String,
        required: [true, "Verify code is required2"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel
