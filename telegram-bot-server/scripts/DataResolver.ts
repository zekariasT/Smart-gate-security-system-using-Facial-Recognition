export function escapeCleaner(text: string): string {
    return text.replace(/[~!@$%^&*()-_=+{}\|;:',.?]/g, "\\$&");
}

export function createUserHyperLink({
    username,
    user_id,
}: {
    username: String;
    user_id: Number;
}): String {
    return escapeCleaner(`@${username}`);
}
