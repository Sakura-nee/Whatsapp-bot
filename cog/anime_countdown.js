'use stric'
const { anime_search } = require('../lib/anilist/graphql');
const { update_data } = require('../lib/update_data');
const trending_anime = require('../lib/countdown/trending_anime');

const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

function replace_month(month) {
    let data = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }
    return data[month];
}

async function anime_countdown(msg) {
    try {
        if(msg.body.split(' ')[1] === undefined) {
            msg.reply(`*?*`);
            return;
        }
        if(msg.body.split(' ')[1] === 'trending') {
            const get_trending_animelist = await trending_anime.trending_anime();
            msg.reply(`\t*Trending Anime Countdown*\n\n${get_trending_animelist}`);
            return;
        }

        if(msg.body.split(' ')[1] === 'notify_on') {
            const title = msg.body.toString().replace('!anime_countdown notify_on', '').trim();
            
            if(title !== '' || title === '!anime_countdown notify_on') {
    
                const get_chat = await msg.getChat();
                const is_group = get_chat.isGroup;
                group_id = false;
                if(is_group) {
                    group_id = await msg.from;
                    client_number = await msg.author;
                } else {
                    client_number = await msg.from;
                }
    
                const animeinfo = await anime_search(title);
                if(animeinfo) {
                    if(resp.status === "RELEASING") {
                        const animeid = animeinfo.id.toString();
                        const anime_title = animeinfo.title.romaji;
                        const update_client = await update_data('add_client', animeid, anime_title, client_number, group_id)
                        msg.reply(update_client);
                    } else {
                        msg.reply('*notify_on* only for ongoing anime!');
                    }
                }
            }
            return false;

        } else if(msg.body.split(' ')[1] === 'notify_off') {
            const title = msg.body.toString().replace('!anime_countdown notify_off', '').trim();
            if(title !== '' || title === '!anime_countdown notify_off') {
    
                const get_chat = await msg.getChat();
                const is_group = get_chat.isGroup;
                group_id = false;
                if(is_group) {
                    group_id = await msg.from;
                    client_number = await msg.author;
                } else {
                    client_number = await msg.from;
                }
    
                const animeinfo = await anime_search(title);
                if(animeinfo) {
                    if(resp.status === "RELEASING" || resp.status === "FINISHED") {
                        const animeid = animeinfo.id.toString();
                        const anime_title = animeinfo.title.romaji;
                        const update_client = await update_data('del_client', animeid, anime_title, client_number, group_id)
                        msg.reply(update_client);
                    }
                }
            }
            return false;
        }
        
        const command = msg.body.toString().replace('!anime_countdown', '').trim();
        const resp = await anime_search(command);

        if(resp.status === "RELEASING") {
            let now = new Date();
            let timeSpan = (resp.nextAiringEpisode.airingAt * 1000) - now;

            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;
                
            const days = Math.floor(timeSpan / day)
            const hours = Math.floor((timeSpan % day) / hour)
            const minutes = Math.floor((timeSpan % hour) / minute)
            const seconds = Math.floor((timeSpan % minute) / second)

            const msg_media = await MessageMedia.fromUrl(resp.bannerImage);
            let message  = `\n*- Title:* _${resp.title.romaji} - EP${resp.nextAiringEpisode.episode}_\n`
            message += `*- Genre:* _${resp.genres.join(', ')}_\n`
            message += `*- Status:* _Ongoing_\n`
            message += `*- Total EP:* ${resp.episodes}\n`
            message += `*- Countdown:* _${days}d ${hours}h ${minutes}m ${seconds}s_\n`
            msg.reply(msg_media, msg._getChatId(), {caption: message});
        } else if(resp.status === "FINISHED") {
            const banner_img = (resp.bannerImage) ? resp.bannerImage : resp.coverImage.large;
            const season_ = []; ((resp.season) ? season_.push(resp.season) : false) + ((resp.seasonYear) ? season_.push(resp.seasonYear) : false)
            const season = (season_.length !== 0) ? season_.join(' - ') : 'Unknown';
            const dor_ = []; (resp.startDate) ? (((resp.startDate.day) ? dor_.push(resp.startDate.day) : false) + ((resp.startDate.month) ? dor_.push(replace_month(resp.startDate.month)) : false) + (resp.startDate.year) ? dor_.push(resp.startDate.year) : false) : false;
            const dor = (dor_.length !== 0) ? dor_.join(' ') : 'Unknown';
            const msg_media = await MessageMedia.fromUrl(banner_img);
            let message  = `\n*- Title:* _${resp.title.romaji}_\n`
            message += `*- Genre:* _${resp.genres.join(', ')}_\n`
            message += `*- Status:* _Finished_\n`
            message += `*- Premiered:* _${dor}_\n`
            message += `*- Season:* _${season}_\n`
            message += `*- Total EP:* ${resp.episodes}\n`
            msg.reply(msg_media, msg._getChatId(), {caption: message});
        } else if(resp.status === "NOT_YET_RELEASED") {
            const banner_img = (resp.bannerImage) ? resp.bannerImage : resp.coverImage.large;
            const season_ = []; ((resp.season) ? season_.push(resp.season) : false) + ((resp.seasonYear) ? season_.push(resp.seasonYear) : false)
            const season = (season_.length !== 0) ? season_.join(' - ') : 'Unknown';
            const dor_ = []; (resp.startDate) ? (((resp.startDate.day) ? dor_.push(resp.startDate.day) : false) + ((resp.startDate.month) ? dor_.push(replace_month(resp.startDate.month)) : false) + (resp.startDate.year) ? dor_.push(resp.startDate.year) : false) : false;
            const dor = (dor_.length !== 0) ? dor_.join(' ') : 'Unknown';
            const msg_media = await MessageMedia.fromUrl(banner_img);
            let message  = `\n*- Title:* _${resp.title.romaji}_\n`
            message += `*- Genre:* _${resp.genres.join(', ')}_\n`
            message += `*- Status:* _Not yet released_\n`
            message += `*- Premiered:* _${dor}_\n`
            message += `*- Season:* _${season}_\n`
            message += `*- Total EP:* ${resp.episodes}\n`
            msg.reply(msg_media, msg._getChatId(), {caption: message});
        }
        return true;
    } catch(e) {
        msg.reply(`*crash*\n\n${e.stack}`);
    }
}

module.exports = {
    main: anime_countdown
}