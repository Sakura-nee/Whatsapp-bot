'use stric'
const fs = require('fs');

async function update_json(type, key, anime_title, value, is_group) {
    if(type === 'release_date') {
        let content = JSON.parse(fs.readFileSync(config.release_date, 'utf8'));
        content[key].has_scheduled = true;
        return fs.writeFileSync(config.release_date, JSON.stringify(content, null, 4));
    }

    if(type === 'add_client') {
        let content = JSON.parse(fs.readFileSync(config.client_file, 'utf8'));
        let obj = Object.keys(content);
        if(!obj.includes(key)) {
            content[key] = {isGroup: {}, privateChat: { client_list: [] }};
            if(is_group) {
                let group_id = Object.keys(content[key].isGroup);

                if(!group_id.includes(is_group)) {
                    content[key].isGroup[is_group] = {client_list: []}
                }

                if(!content[key].isGroup[is_group].client_list.includes(value)) {
                    content[key].isGroup[is_group].client_list.push(value)
                } else {
                    return `You has been on the list`;
                }
            } else {
                if(!content[key].privateChat.client_list.includes(value)) {
                    content[key].privateChat.client_list.push(value)
                } else {
                    return `You has been on the list`;
                }
                
            }
        } else {
            if(is_group) {
                let group_id = Object.keys(content[key].isGroup);

                if(!group_id.includes(is_group)) {
                    content[key].isGroup[is_group] = {client_list: []}
                }

                if(!content[key].isGroup[is_group].client_list.includes(value)) {
                    content[key].isGroup[is_group].client_list.push(value)
                } else {
                    return `You has been on the list`;
                }
            } else {
                if(!content[key].privateChat.client_list.includes(value)) {
                    content[key].privateChat.client_list.push(value)
                } else {
                    return `You has been on the list`;
                }
            }
        }
        fs.writeFileSync(config.client_file, JSON.stringify(content, null, 4));
        return `You will get notification when new episode of anime *${anime_title}* is released`;
    }
    
    else if(type === 'del_client') {
        let content = JSON.parse(fs.readFileSync(config.client_file, 'utf8'));
        let obj = Object.keys(content);
        if(obj.includes(key)) {
            if(is_group) {
                let group_id = Object.keys(content[key].isGroup);

                if(!group_id.includes(is_group)) {
                    return 'invalid group_id';
                }

                if(content[key].isGroup[is_group].client_list.includes(value)) {
                    content[key].isGroup[is_group].client_list = content[key].isGroup[is_group].client_list.filter(item => item !== value);
                    fs.writeFileSync(config.client_file, JSON.stringify(content, null, 4));
                    return `You have been removed from the list`;
                } else {
                    return `You are not on the list of recipients`;
                }
            } else {
                if(content[key].privateChat.client_list.includes(value)) {
                    content[key].privateChat.client_list = content[key].privateChat.client_list.filter(item => item !== value);
                    fs.writeFileSync(config.client_file, JSON.stringify(content, null, 4));
                    return `You have been removed from the list`;
                } else {
                    return `You are not on the list of recipients`;
                }
            }
        } else {
            return 'invalid anime id';
        }
    }
}

module.exports = {
    update_data: update_json
}