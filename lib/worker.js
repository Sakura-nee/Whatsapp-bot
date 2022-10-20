const fs = require('fs');
const moment = require('moment-timezone');
const { MessageMedia } = require('whatsapp-web.js');
const { update_data } = require('../lib/update_data');

let container = new Array();
let tz_data = 'Asia/Jakarta';
function worker(id, status, name) {
    if(status === 'start') {
        return new Promise((resolve, reject) => {
            if(!container[id]) {
                container[id] = main(name);
            }
        });
    } else {
        console.log(`${id} has stoped`)
        clearInterval(container[id]);
    }
}

async function send_msg(key, message) {
    const msg_media = await MessageMedia.fromUrl(message.thumb);
    const load_obj_client_list = JSON.parse(fs.readFileSync(config.client_file).toString());
    const group_length = Object.keys(load_obj_client_list[key].isGroup)
    const privateChat_length = load_obj_client_list[key].privateChat.client_list;
    if(group_length.length !== 0) {
        for(let group_id of group_length) {
            mentions = []
            for(let client_id of load_obj_client_list[key].isGroup[group_id].client_list) {
                const contact = await client.getContactById(client_id);
                mentions.push(contact); 
            }
            client.sendMessage(group_id, msg_media, { mentions, caption: message.msg });
        }
    }
    
    if(privateChat_length !== 0) {
        for(let client_id of load_obj_client_list[key].privateChat.client_list) {
            client.sendMessage(client_id, msg_media, { mentions, caption: message.msg }); 
        }
    }
}

async function main(key) {
    setInterval(async function(){
        const load_obj = JSON.parse(fs.readFileSync(config.release_date).toString());
        if(load_obj[key]) {
            const schedule = moment.tz(parseInt(load_obj[key].time), tz_data);
            const date_now = moment.tz(tz_data);

            const minute = (date_now.minute() === schedule.minute()) ? true : false;
            const hours = (date_now.hour() === schedule.hour()) ? true : false;
            const date = (date_now.date() === schedule.date()) ? true : false;
            const month = ((date_now.month()) === schedule.month()) ? true : false;
            const year = (date_now.year() === schedule.year()) ? true : false;

            if(minute && hours && date && month && year) {
                if(!load_obj[key].has_scheduled) {
                    let message = `${load_obj[key].title} Episode ${load_obj[key].episode} has been released!`;
                    send_msg(key, {msg: message, thumb: load_obj[key].thumb});
                    await worker(key, 'stop', key);
                    await update_data('release_date', key, true);
                }
            }
        }
    }, 10000)
}

function notify() {
    console.log('notify loaded');
    new Promise((resolve, reject) => {
        setInterval(async function() {
            const load_obj = JSON.parse(fs.readFileSync(config.release_date).toString());
            const obj_keys = Object.keys(load_obj)
            if(obj_keys[0] !== undefined) {
                for(let obj_key of obj_keys) {
                    if(container[load_obj[obj_key].title] === undefined) {
                        worker(load_obj[obj_key].title, 'start', obj_key);
                        console.log(`worker started: ${load_obj[obj_key].title}`);
                    }
                }
            }
        }, 10000);
    });
}

module.exports = {
    start_schedule: notify,
    worker: worker,
}
