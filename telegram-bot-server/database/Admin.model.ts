import { Schema, model, connect } from "mongoose";

type Status = "purchased" | "registered";
// 1. Create an interface representing a document in MongoDB.
interface IAdmin {
    name: string;
    chat_id: number;
}

// 2. Create a Schema corresponding to the document interface.
const adminSchema = new Schema<IAdmin>({
    name: { type: String, required: true },
    chat_id: { type: Number, unique: true },
});

// 3. Create a Model.
const Admin = model<IAdmin>("Admin", adminSchema);

export { Admin };
