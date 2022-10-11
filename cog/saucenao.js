'use-stric'
const { MessageMedia } = require('whatsapp-web.js');
const { saucenao } = require('../lib/saucenao/saucenao')

async function saucenao_search(msg) {
    if(msg.hasMedia || msg.hasQuotedMsg) {
        if(msg.hasQuotedMsg) {
            quoted_msg = await msg.getQuotedMessage();
            console.log(quoted_msg)
            if(quoted_msg.hasMedia && quoted_msg.type == 'image') {
                const img_body = quoted_msg._data.body;
                const imgbuffer = Buffer.from(img_body, 'base64');
                const sauce_is = await saucenao(imgbuffer);
                let msg_sauce = '';
                if(sauce_is[0] !== undefined) {
                    for(let data_sauce of sauce_is) {
                        msg_sauce += `*TITLE:* ${data_sauce.title}\n*SIMILARITY:* ${data_sauce.similarity}\n\n`
                    }
                } else {
                    msg_sauce += `cannot find the sauce`
                }
                msg.reply(msg_sauce.trim());
            }
        } else {
            const receivedImage = await msg.downloadMedia();
            msg.reply(`please wait searching...`);
            const img_body =  receivedImage.data;
            const imgbuffer = Buffer.from(img_body, 'base64');
            const sauce_is = await saucenao(imgbuffer);
            let msg_sauce = '';
            if(sauce_is[0] !== undefined) {
                for(let data_sauce of sauce_is) {
                    msg_sauce += `*TITLE:* ${data_sauce.title}\n*SIMILARITY:* ${data_sauce.similarity}\n\n`
                }
            } else {
                msg_sauce += `cannot find the sauce`
            }
            msg.reply(msg_sauce.trim());
        }
    }
}

module.exports = {
    main: saucenao_search,
}
