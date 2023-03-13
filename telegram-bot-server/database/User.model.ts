import { Schema, model, connect } from "mongoose";

type Status = "purchased" | "registered";
// 1. Create an interface representing a document in MongoDB.
interface IUser {
    name: string;
    email: string;
    device_id: string;
    chat_id: number;
    status: Status;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    device_id: { type: String, required: true },
    chat_id: { type: Number },
    status: { type: String, required: true },
});

// 3. Create a Model.
const User = model<IUser>("User", userSchema);

export { User };
