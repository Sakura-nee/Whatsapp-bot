const fs = require('fs');
const moment = require('moment-timezone');
const { MessageMedia } = require('whatsapp-web.js');

let container = new Array();
let tz_data = 'Asia/Jakarta';
function worker(id, status, name, client) {
    if(status === 'start') {
        return new Promise((resolve, reject) => {
            if(!container[id]) {
                container[id] = main(name, client);
            }
        });
    } else {
        console.log(`${id} has stoped`)
        clearInterval(container[id]);
    }
}

async function send_msg(number, client, message) {
    const msg_media = await MessageMedia.fromUrl(message.thumb);
    client.sendMessage(number, msg_media, {caption: message.msg});
}

async function main(key, client) {
    setInterval(async function(){
        const load_obj = JSON.parse(fs.readFileSync('./json/release_date.json').toString());
        if(load_obj[key]) {
            const schedule = moment.tz(parseInt(load_obj[key].time), tz_data);
            const now = new Date();
            const date_now = moment.tz(now, tz_data);

            const minute = (date_now.minute() === schedule.minute()) ? true : false;
            const hours = (date_now.hour() === schedule.hour()) ? true : false;
            const date = (date_now.date() === schedule.date()) ? true : false;
            const month = ((date_now.month() + 1) === schedule.month()) ? true : false;
            const year = (date_now.year() === schedule.year()) ? true : false;

            if(minute && hours && date && month && year) {
                if(!load_obj[key].has_scheduled) {
                    const load_obj_client_list = JSON.parse(fs.readFileSync('./json/client_list.json').toString());
                    for(let client_list of load_obj_client_list[key]) {
                        console.log(`notify ${load_obj[key].title} sent to target => ${client_list}`);
                        let message = `${load_obj[key].title} Episode ${load_obj[key].episode} was released!`;
                        send_msg(client_list, client, {msg: message, thumb: load_obj[key].thumb});
                    }
                    await worker(key, 'stop', key);
                    await update_json('release_date', key, true);
                }
            }
        }
    }, 10000)
}

function notify(client) {
    console.log('notify loaded');
    new Promise((resolve, reject) => {
        setInterval(async function() {
            const load_obj = JSON.parse(fs.readFileSync('./json/release_date.json').toString());
            const obj_keys = Object.keys(load_obj)
            if(obj_keys[0] !== undefined) {
                for(let obj_key of obj_keys) {
                    if(container[load_obj[obj_key].title] === undefined) {
                        worker(load_obj[obj_key].title, 'start', obj_key, client);
                        console.log(`worker started: ${load_obj[obj_key].title}`);
                    }
                }
            }
        }, 10000);
    });
}

async function update_json(type, key, anime_title, value) {
    if(type === 'release_date') {
        let content = JSON.parse(fs.readFileSync('./json/release_date.json', 'utf8'));
        content[key].has_scheduled = true;
        return fs.writeFileSync('./json/release_date.json', JSON.stringify(content, null, 4));
    } else if(type === 'add_client') {
        let content = JSON.parse(fs.readFileSync('./json/client_list.json', 'utf8'));
        let obj = Object.keys(content);
        if(!obj.includes(key)) {
            content[key] = [];
            content[key].push(value);
            fs.writeFileSync('./json/client_list.json', JSON.stringify(content, null, 4));
            return `You will get notification when new episode of anime *${anime_title}* is released`;
        } else {
            if(content[key].includes(value)) {
                return `You has been on the list`;
            } else {
                content[key].push(value);
                fs.writeFileSync('./json/client_list.json', JSON.stringify(content, null, 4));
                return `You will get notification when new episode of anime *${anime_title}* is released`;
            }
        }
    } else if(type === 'del_client') {
        let content = JSON.parse(fs.readFileSync('./json/client_list.json', 'utf8'));
        let obj = Object.keys(content);
        if(obj.includes(key)) {
            if(content[key].includes(value)) {
                content[key] = content[key].filter(item => item !== value);
                fs.writeFileSync('./json/client_list.json', JSON.stringify(content, null, 4));
                return `You have been removed from the list`;
            } else {
                return `You are not on the list of recipients`;
            }
        } else {
            return `invalid key`;
        }
    }
}

module.exports = {
    start_schedule: notify,
    update_data: update_json,
    worker: worker,
}