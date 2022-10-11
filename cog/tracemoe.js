'use-stric'
const { MessageMedia } = require('whatsapp-web.js');
const { tracemoe } = require('../lib/saucenao/tracemoe');

async function tracemoe_search(msg) {
    if(msg.hasMedia || msg.hasQuotedMsg) {
        if(msg.hasQuotedMsg) {
            quoted_msg = await msg.getQuotedMessage();
            if(quoted_msg.hasMedia && quoted_msg.type == 'image') {
                msg.reply(`Please wait searching...`);
                const img_body = quoted_msg._data.body;
                const imgbuffer = Buffer.from(img_body, 'base64');
                const sauce_is = await tracemoe(imgbuffer);
                let msg_sauce = '';
                if(sauce_is.title !== undefined) {
                    const msg_media = await MessageMedia.fromUrl(decodeURIComponent(sauce_is.frame));
                    msg_media.filename = "frame.png";
                    msg_sauce += `*TITLE:* ${sauce_is.title}\n*SIMILARITY:* ${sauce_is.similarity}\n*MAL:* ${sauce_is.mal}\n*TYPE:* ${sauce_is.type}\n*GENRE:* ${sauce_is.genre}\n*STATUS:* ${sauce_is.status}`
                    msg.reply(msg_media, msg._getChatId(), {caption: msg_sauce.trim()});
                } else {
                    msg_sauce += `Cannot find the sauce`
                    msg.reply(msg_sauce.trim());
                }
            }
        } else {
            const receivedImage = await msg.downloadMedia();
            msg.reply(`Please wait searching...`);
            const img_body =  receivedImage.data;
            const imgbuffer = Buffer.from(img_body, 'base64');
            const sauce_is = await tracemoe(imgbuffer);
            let msg_sauce = '';
            if(sauce_is.title !== undefined) {
                const msg_media = await MessageMedia.fromUrl(decodeURIComponent(sauce_is.frame));
                msg_media.filename = "frame.png";
                msg_sauce += `*TITLE:* ${sauce_is.title}\n*SIMILARITY:* ${sauce_is.similarity}\n*MAL:* ${sauce_is.mal}\n*TYPE:* ${sauce_is.type}\n*GENRE:* ${sauce_is.genre}\n*STATUS:* ${sauce_is.status}`
                msg.reply(msg_media, msg._getChatId(), {caption: msg_sauce.trim()});
            } else {
                msg_sauce += `cannot find the sauce`
                msg.reply(msg_sauce.trim());
            }
        }
    }
}

module.exports = {
    main: tracemoe_search,
}
