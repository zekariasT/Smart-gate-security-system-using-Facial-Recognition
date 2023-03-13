import * as dotenv from "dotenv";
import { Scenes, session, Telegraf } from "telegraf";
import { User, Admin } from "./database";

dotenv.config();

const token = process.env.BOT_TOKEN || "";
const bot = new Telegraf(token);

// Handler factories
const { enter, leave } = Scenes.Stage;

// Greeter scene

const stage = new Scenes.Stage<Scenes.SceneContext>();

bot.use(session());
// bot.use(stage.middleware());
bot.use((ctx, next) => {
    console.log(ctx.message || "new ctx");
    return next();
});
bot.start(async (ctx) => {
    ctx.reply("Hi there, to register this bot, please send your device ID");
});

bot.command("register", async (ctx) => {
    await Admin.findOne({ chat_id: ctx.chat.id }).then(async (response) => {
        if (response) {
            let NewUser = {};

            ctx.message.text
                .split(" ")
                .filter((item) => (item == "/register" ? false : true))
                .map((item) => {
                    NewUser = {
                        ...NewUser,
                        [item.split("-")[0]]: item.split("-")[1],
                    };
                });

            await User.create({ ...NewUser, status: "registered" })
                .then(() => {
                    ctx.reply("Successfully registered user and device!");
                })
                .catch((err) => {
                    console.log(err);
                    ctx.reply(err);
                });
        }
    });
});

//User gets registered
bot.on("text", async (ctx) => {
    let message = ctx.message.text;
    let device_id_pattern = /[A-Z0-9]{8}/;
    let secret_pattern = /[a-z0-9]{6}/;

    /**
     * Register device users
     */
    if (message.match(device_id_pattern)) {
        await User.findOne({ device_id: message }).then((user) => {
            if (user) {
                user.status = "registered";
                user.chat_id = ctx.message.chat.id;
                user.save()
                    .then(() => console.log("New user registered"))
                    .then(() =>
                        ctx.reply(
                            "Successfully registered, you will be alerted when there is a face detected"
                        )
                    );
            } else
                ctx.reply(
                    "Unable to recognize your device ID, please make sure you have typed it correctly"
                );
        });
    } else if (message.match(secret_pattern)) {
        /**
         * Register admins using super secret message
         */
        if (message == process.env.SECRET) {
            await Admin.create({
                chat_id: ctx.message.chat.id,
                name: ctx.from.username,
            })
                .then(() => ctx.reply("Seller registered"))
                .catch((err) => ctx.reply(err));
        }
    }
});

bot.command("help", async (ctx) => {});

export default bot;
