'use stric'
const axios = require('axios');
const FormData = require('form-data');
const { anime_info } = require('../anilist/graphql');

async function tracemoe(image) {
    const form = new FormData();
    form.append('file', image, 'yuuki.jpeg');
    const response = await axios.post('https://api.trace.moe/search', form, {
        headers: {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
            }
        }
    });
    if(response.data.error === '') {
        const result = response.data.result[0];
        const anilist_info = await anime_info(result.anilist);
        anilist_info.similarity = `${parseFloat(result.similarity * 100).toPrecision(3)}%`;
        anilist_info.frame = `${result.image}`;
        return anilist_info;
    }
}

module.exports = {
    tracemoe: tracemoe
}