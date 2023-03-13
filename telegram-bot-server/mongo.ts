import mongoose, { ConnectOptions } from "mongoose";

require("dotenv").config();

let database: mongoose.Connection;

export const connect = async () => {
    // add your own uri below

    let uri: string = "";

    if (process.env["MONGO_URI"]) {
        uri = process.env.MONGO_URI;
    }

    if (database) {
        return;
    }

    let connectOpts = {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    };

    mongoose
        .connect(uri)
        .then()
        .catch((err) => {
            console.log({ err });
        });

    database = mongoose.connection;

    database.once("open", async () => {
        console.log("Connected to database");
    });

    database.on("error", () => {
        console.log("Error connecting to database");
    });
};

export const disconnect = () => {
    if (!database) {
        return;
    }
    mongoose.disconnect();
    console.log("Disconnected from database");
};
