import mongoose, {Schema, Document, Model, ObjectId} from "mongoose";

export interface Message extends Document{
    _id: any; 
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

const MessageModel = (mongoose.models.Message as Model<Message>) || (mongoose.model<Message>('Message', MessageSchema))

export default MessageModel;