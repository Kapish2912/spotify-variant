import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: String , required: true },  // clerk user id
        receiverId: { type: String , required: true }, // clerk user id
        content: { type: String , required: true },
    },
    { timestamps: true }
); // createdAt , updatedAt

export const Message = mongoose.model("Message", messageSchema); // model name is Message