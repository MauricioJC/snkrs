require('dotenv').config();
const { Telegram, Telegraf } = require('telegraf')

exports.TelegramBot = class {
    constructor() {
        this.bot = new Telegraf(process.env.BOT_TOKEN);
    }

    setStartFunction(fn) {
        this.bot.start((ctx) => {
            fn(ctx);
            ctx.reply("[Beta]\nBienvenido 🥳\nNuevos lanzamientos todos los días 7:00 am.\nNotificaciones de disponibilidad de 7:00 am a 2:00 am.");
        });
    }

    start() {
        this.bot.launch();
    }
};

exports.TelegramNotification = class {
    constructor() {
        this.bot = new Telegram(process.env.BOT_TOKEN);
    }

    async sendMessage(users, message) {
        users.forEach(user => {
            this.bot.sendMessage(
                user,
                message
            );
        });
    }
}