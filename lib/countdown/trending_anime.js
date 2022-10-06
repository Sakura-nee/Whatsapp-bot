'use stric'
const axios = require('axios');
const cheerio = require('cheerio');

async function trending_anime() {
    try {
        const response = await axios.get('https://animecountdown.com/trending');
        const $ = cheerio.load(response.data);
        let msg = '';
        $('body > countdown-root > countdown > countdown-content > countdown-content-trending > countdown-content-trending-items').each((index, element) => {
            const $ = cheerio.load(element);
            $('a').each((index, element) => {
                const $ = cheerio.load(element);
                let release_date;
                let msg_0 = '';
                const title = $('countdown-content-trending-item-title').text();
                const eps   = $('countdown-content-trending-item-desc').text();
                const time  = $('countdown-content-trending-item-countdown')[0].attribs['data-time'];
                if(time.toString().startsWith('-') === false) {
                    if(time.toString() !== '0') {
                        release_date = ((+new Date / 1e3 | 0) + parseInt(time))

                        let now = new Date();
                        let timeSpan = (release_date * 1000) - now;

                        const second = 1000;
                        const minute = second * 60;
                        const hour = minute * 60;
                        const day = hour * 24;
                            
                        const days = Math.floor(timeSpan / day)
                        const hours = Math.floor((timeSpan % day) / hour)
                        const minutes = Math.floor((timeSpan % hour) / minute)
                        const seconds = Math.floor((timeSpan % minute) / second)
                        msg_0 += `Title: ${title} - ${eps}\n`
                        msg_0 += `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`
                        msg += `${msg_0}\n\n`
                    }
                }
            })
        })
        msg += 'STFU';
        fixed = msg.replace('\n\nSTFU', '')
        return fixed;
    } catch(e) {
        return e.stack;
    }
}

module.exports = {
    trending_anime: trending_anime
}
