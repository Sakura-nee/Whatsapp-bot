const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { load_cog, unload_cog, reload_cog } = require('./lib/load_cog');
const { start_schedule } = require('./lib/worker');
global.config = require('./config.json');

yuuki = {}

global.client = new Client({
    puppeteer: {
		headless: false,
	},
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    start_schedule();
    console.log('Client is ready!');
});

client.on('message', async msg => {
    const cmd = msg.body.split(' ')[0].split('!')[1]
    const module_name = msg.body.split(' ')[1]
    if(cmd == 'load_cog' || cmd == 'load') {
        const load_status = await load_cog(module_name, yuuki);
        if(load_status) {
            msg.reply(load_status);
        } else {
            msg.reply(`unknown error`);
        }
    }

    if(cmd == 'unload_cog' || cmd == 'unload') {
        const unload_status = await unload_cog(module_name, yuuki);
        if(unload_status) {
            msg.reply(unload_status);
        } else {
            msg.reply(`unknown error`);
        }
    }

    if(cmd == 'reload_cog' || cmd == 'reload') {
        const unload_status = await reload_cog(module_name, yuuki);
        if(unload_status) {
            msg.reply(unload_status);
        } else {
            msg.reply(`unknown error`);
        }
    }

    if(cmd == 'list') {
        if(module_name == 'active_module' || module_name == 'actived_module') {
            const Obj_arr = Object.keys(yuuki);
            let text_to_send = "there all actived module:\n\n"
            for(let actived_module of Obj_arr) {
                text_to_send += `\t- ${actived_module}\n`
            }
            msg.reply(text_to_send);
        }
    }

    if(yuuki.hasOwnProperty(cmd)) {
        yuuki[cmd].main(msg, client);
    }
});

client.initialize();
