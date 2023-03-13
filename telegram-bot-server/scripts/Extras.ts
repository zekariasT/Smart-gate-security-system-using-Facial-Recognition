import { Types } from "mongoose";

export function generateString(length: Number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
}

export function checkObjectIdValid(id: string) {
    return Types.ObjectId.isValid(id)
        ? String(new Types.ObjectId(id)) == id
            ? true
            : false
        : false;
}
