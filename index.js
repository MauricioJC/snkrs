const express = require('express')
const app = express()
const port = 80
var cron = require("node-cron");
const nike = require('./src/nike');
const { Database } = require('./src/database')
const { TelegramBot, TelegramNotification } = require('./src/notifications');
const _users = {
    telegram: [],
};
const _notifications = {
    jordan: [],
    upcoming: [],
};
const _ignore = ['niños', 'niñas', 'grandes', 'infantil', 'pequeña', 'pequeño'];
const _database = new Database();

_users.telegram = _database.usuarios();

const _telegramNotification = new TelegramNotification();
const _telegram = new TelegramBot();
_telegram.setStartFunction((ctx) => {
    if (!_users.telegram.includes(ctx.message.chat.id)) {
        _users.telegram.push(ctx.message.chat.id);
        _database.save(_users.telegram);
    }
});
_telegram.start();

let date = function () {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

let valid = function (url) {
    let result = true;
    _ignore.forEach(function (ignore) {
        if (url.includes(ignore)) {
            result = false;
            return;
        }
    });
    return result;
};

let send = function (tipo, url) {
    if (_notifications[tipo].includes(url)) {
        return true;
    }
    return false;
};

let fnJordan = async function () {
    let messages = await nike.jordan();
    let final = [];
    messages.forEach((message) => {
        if (valid(message.link)) {
            if (!send('jordan', message.link)) {
                _telegramNotification.sendMessage(_users.telegram, message.message);
            }
            final.push(message.link);
        }
    });
    _notifications.jordan = final;
};

let fnUpcoming = async function () {
    let messages = await nike.upcoming();
    let final = [];
    messages.forEach((message) => {
        if (valid(message.link)) {
            if (!send('upcoming', message.link)) {
                _telegramNotification.sendMessage(_users.telegram, message.message);
            }
            final.push(message.link);
        }
    });
    _notifications.upcoming = final;
};

cron.schedule("*/4 7-23,0 * * *", async () => {
    await fnJordan();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

cron.schedule("*/4 0-2,0 * * *", async () => {
    await fnJordan();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

cron.schedule('0 7 * * *', async () => {
    await fnUpcoming();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

app.get('/', function (req, res) {
    return res.send("Running...");
});

app.get('/jordan', async (req, res) => {
    const messages = await nike.jordan();
    return res.send(messages);
});

app.get('/upcoming', async (req, res) => {
    const messages = await nike.upcoming();
    return res.send(messages);
});

app.get('/users', async (req, res) => {
    return res.send(`Total: ${_users.telegram.length}`);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});