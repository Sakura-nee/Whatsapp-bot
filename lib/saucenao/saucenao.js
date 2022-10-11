'use stric'
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');

async function saucenao(image) {
    const form = new FormData();
    let arr = new Array();
    form.append('file', image, 'yuuki.jpeg');
    const resp = await axios.post('https://saucenao.com/search.php', form, {
        headers: {
            headers: {
                'authority': 'saucenao.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'en,id-ID;q=0.9,id;q=0.8,en-US;q=0.7,zh-CN;q=0.6,zh;q=0.5',
                'content-type': 'multipart/form-data',
                'origin': 'https://saucenao.com',
                'referer': 'https://saucenao.com/',
                'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
            }
        }
    });
    const $ = cheerio.load(resp.data);
    let enable_loop = true;
    $('#middle > .result').each((index, element) => {
        const hh = $(element.prev).html();
        if(hh !== null) {
            if(hh.includes('Click here to display them')) {
                enable_loop = false;
            }
            if(enable_loop) {
                arr.push(hh)
            }
        }
    });
    
    let Obj = new Array();
    for(let html of arr){
        const $3 = cheerio.load(html);
        let similarityinfo;
        let resulttitle;
        $3('.resulttable > tbody > tr > td.resulttablecontent > .resultmatchinfo > .resultsimilarityinfo').each((index, element) => {
            similarityinfo = $3(element).text();
        })
        $3('.resulttable > tbody > tr > td.resulttablecontent > .resultcontent > .resulttitle').each((index, element) => {
            resulttitle = $3(element).text();
        })
        Obj.push({title: resulttitle, similarity: similarityinfo})
    }
    console.log(Obj);
    return Obj;
}

module.exports = {
    saucenao: saucenao
}