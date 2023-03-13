import PocketBase from "pocketbase";

const DB_HOST = process.env.DB_HOST;
const DB_EMAIL = process.env.DB_EMAIL || "localhost";
const DB_PASS = process.env.DB_PASS || "";

const PB = new PocketBase(DB_HOST);

const loginPB = async () => {
    return new Promise<void>((resolve, reject) => {
        PB.admins
            .authWithPassword(DB_EMAIL, DB_PASS)
            .then(() => {
                console.log("DB Logged in");
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export { PB, loginPB };
