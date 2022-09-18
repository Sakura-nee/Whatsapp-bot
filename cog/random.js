'use-stric'
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

async function random(msg) {
    msg.reply('hii');
}

module.exports = {
    main: random,
}