const axios = require('axios');
const fs = require('fs');
const { anilist_id, anilist_search } = require('./query');

async function send_query(query, variable) {
    try {
        const response = await axios.post(
            'https://graphql.anilist.co/',
            {
                'query': query,
                'variables': variable
            },
            {
                headers: {
                    'authority': 'graphql.anilist.co',
                    'accept': 'application/json',
                    'accept-language': 'en,id-ID;q=0.9,id;q=0.8,en-US;q=0.7,zh-CN;q=0.6,zh;q=0.5',
                    'content-type': 'application/json',
                    'origin': 'https://anilist.co',
                    'referer': 'https://anilist.co/',
                    'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
                }
            }
        );
        return response.data;
    } catch (e) {
        return {error: true};
    }
}

async function anime_search(title) {
    try {
        const variable = {
            search: title,
            page: 1,
            perPage: 10
        }
        const response = await send_query(anilist_search(), variable);
        if(response.error !== true) {
            for(let anime_info of response.data.Page.media) {
                if(anime_info.type === 'ANIME' && anime_info.status === 'RELEASING') {
                    extract_key(anime_info);
                    return anime_info;
                } if(anime_info.type) {
                    return anime_info;
                }
            }
        }
    } catch (e) {
        return {error: true};
    }
}


async function anilist(anime_id) {
    try {
        const variable = {
            id: parseInt(anime_id)
        }
        const response = await send_query(anilist_id(), variable);
        if(response.error !== true) {
            const respon = {
                title: `${response.data.Media.title.romaji}`,
                mal:  (response.data.Media.idMal !== null) ? `https://myanimelist.net/anime/${response.data.Media.idMal}` : `null`,
                type: `${response.data.Media.type}`,
                genre: `${(response.data.Media.genres).join(', ')}`,
                status: `${response.data.Media.status}`,
                cover: `${response.data.Media.coverImage.large}`
            }
            return respon;
        }
        return {error: true};
    } catch (e) {
        return {error: true};
    }
}

async function extract_key(obj) {
    const conf = JSON.parse(fs.readFileSync(config.release_date).toString());
    conf[obj.id] = {
            title: obj.title.romaji,
            thumb: obj.bannerImage,
            episode: obj.nextAiringEpisode.episode,
            time: (obj.nextAiringEpisode.airingAt * 1000),
            has_scheduled: false
    }
    fs.writeFileSync(config.release_date, JSON.stringify(conf, null, 4))
}

module.exports = {
    anime_search: anime_search,
    anime_info: anilist
}