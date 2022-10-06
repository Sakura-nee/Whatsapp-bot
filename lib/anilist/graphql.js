'use stric';
const axios = require('axios');

const query = `query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            perPage
        }
        media(search: $search, type: ANIME, sort: FAVOURITES_DESC) {
            id
            title {
                romaji
            }
            type
            genres
            status
            format
            source
            duration
            episodes
            bannerImage
            nextAiringEpisode {
                id
                episode
                timeUntilAiring
                airingAt
            }
            coverImage {
                large
                medium
            }
        }
    }
}`;

async function anime_info(title) {
	try {
		const response = await axios.post(
			'https://graphql.anilist.co/',
			{
				'query': query,
				'variables': {
					search: title,
					page: 1,
					perPage: 10
				}
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
		for(let anime_info of response.data.data.Page.media) {
			if(anime_info.type === 'ANIME' && anime_info.status === 'RELEASING') {
				return anime_info;
			}
		}
	} catch (e) {
		return {error: true};
	}
}

module.exports = {
	anime_info: anime_info
}
