'use stric'
const { anime_info } = require('../lib/anilist/graphql');
const { update_data } = require('../lib/worker');
const trending_anime = require('../lib/countdown/trending_anime');

const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

async function anime_countdown(msg) {
    try {
        if(msg.body.split(' ')[1] === undefined) {
            msg.reply(`*anime cuntdown*`); // supported file hosting:\n- https://drop.download/
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
                const number = await msg.from;
                const animeinfo = await anime_info(title);
                if(animeinfo) {
                    const animeid = animeinfo.id.toString();
                    const anime_title = animeinfo.title.romaji;
                    const update_client = await update_data('add_client', animeid, anime_title, number)
                    msg.reply(update_client);
                }
            }
            return false;
        } else if(msg.body.split(' ')[1] === 'notify_off') {
            const title = msg.body.toString().replace('!anime_countdown notify_off', '').trim();
            if(title !== '' || title === '!anime_countdown notify_off') {
                const number = await msg.from;
                const animeinfo = await anime_info(title);
                console.log(animeinfo);
                if(animeinfo) {
                    const animeid = animeinfo.id.toString();
                    const anime_title = animeinfo.title.romaji;
                    const update_client = await update_data('del_client', animeid, anime_title, number)
                    msg.reply(update_client);
                }
            }
            return false;
        }
        
        const command = msg.body.toString().replace('!anime_countdown', '').trim();
        const resp = await anime_info(command);
        console.log(resp)

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
        message += `*- Total EP:* ${resp.episodes}\n`
        message += `*- Countdown:* _${days}d ${hours}h ${minutes}m ${seconds}s_\n`
        msg.reply(msg_media, msg._getChatId(), {caption: message});
        return true;
    } catch(e) {
        msg.reply(`*crash*\n\n${e.stack}`);
    }
}

module.exports = {
    main: anime_countdown
}