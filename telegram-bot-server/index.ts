import * as dotenv from "dotenv";

import { connect, disconnect } from "./mongo";
import { Capture, User } from "./database";
import { escapeCleaner } from "./scripts";
import { Request, Response } from "restify";

import restify from "restify";
import bot from "./telegram";
import fs from "fs";
import { deprecate } from "util";

dotenv.config();

const PORT = process.env.PORT || 8080;
const URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:" + PORT
        : "PRODUCTION";
const server = restify.createServer({
    name: "main-server",
    version: "1.0.0",
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
// server.use(restify.plugins.bodyParser());
server.use(restify.plugins.multipartBodyParser());

server.get("/", function (req: Request, res: Response, next: () => any) {
    res.send(req.params);
    return next();
});

async function deprecatedCode(req: any, res: any) {
    const startOfDay = new Date().setHours(0, 0, 0, 0).toString();
    const endOfDay = new Date().setUTCHours(23, 59, 59, 999).toString();
    const device_id = req.body.device_id;
    const prediction = req.body.prediction;
    const detection_time = req.body.detection_time;

    let saved = false;

    let Image = req?.files?.image;

    await User.findOne({ device_id: device_id }).then((user) => {
        if (user && Image) {
            bot.telegram.sendPhoto(
                user.chat_id,
                { source: Image.path },
                {
                    caption: `${prediction} Detected - At ${detection_time}`,
                }
            );
        } else {
            console.log("User not found");
        }
    });

    await Capture.findOne({
        device_id: device_id,
        start_date: startOfDay,
    }).then(async (result) => {
        if (result) {
            result.detections.push({
                prediction: prediction,
                img_location: req.body.image_location,
                detection_time: detection_time,
            });
            await result.save().then(() => (saved = true));
        } else {
            const newCapture = new Capture({
                device_id: req.body.device_id,
                start_date: startOfDay,
                end_date: endOfDay,
                detections: [
                    {
                        prediction: req.body.predictions,
                        img_location: req.body.img_location,
                        detection_time: Date.now(),
                    },
                ],
            });

            await newCapture.save().then(() => (saved = true));
        }
    });
    res.send(req.params);
    console.log(saved);
}

server.post(
    "/",
    /**
     * Takes in device_id and other information and then
     * texts user registered with the device id
     *
     * @async
     * @param {device_id}
     * @param {prediction}
     * @param {detection_time}
     */ async function (
        req: Request,
        res: Response,
        next: () => any
    ): Promise<any> {
        const device_id = req.body.device_id;
        const prediction = req.body.prediction;
        const detection_time = req.body.detection_time;

        let Image = req?.files?.image;

        await User.findOne({ device_id: device_id }).then((user) => {
            if (user && Image) {
                bot.telegram.sendPhoto(
                    user.chat_id,
                    { source: Image.path },
                    {
                        caption: `${prediction} Detected - At ${detection_time}`,
                    }
                );
            } else {
                console.log("User not found");
            }
        });
    }
);

server.listen(PORT, function () {
    console.log("%s listening at %s", server.name, URL);
});

connect();

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => {
    bot.stop("SIGINT");
    disconnect();
});
process.once("SIGTERM", () => {
    bot.stop("SIGTERM");
    disconnect();
});
