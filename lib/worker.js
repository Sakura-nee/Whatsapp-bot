const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

let container = new Array();
function worker(id, status, name, client) {
    if(status === 'start') {
        return new Promise((resolve, reject) => {
            container[id] = main(name, client);
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
        const fs = require('fs');
        const load_obj = JSON.parse(fs.readFileSync('./json/release_date.json').toString());
        const schedule = new Date(new Date(parseInt(load_obj[key].time)).toLocaleString());
        const date_now = new Date();
        const minute = (date_now.getMinutes() === schedule.getMinutes()) ? true : false;
        const hours = (date_now.getHours() === schedule.getHours()) ? true : false;
        const date = (date_now.getDate() === schedule.getDate()) ? true : false;
        const month = ((date_now.getMonth() + 1) === schedule.getMonth()) ? true : false;
        const year = (date_now.getFullYear() === schedule.getFullYear()) ? true : false;

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
    }, 10000)
}

function notify(client) {
    console.log('notify loaded');
    const load_obj = JSON.parse(fs.readFileSync('./json/release_date.json').toString());
    for(let obj_key of Object.keys(load_obj)) {
        worker(obj_key.title, 'start', obj_key, client);
    }
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
