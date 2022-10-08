'use-stric'
const { MessageMedia } = require('whatsapp-web.js');

async function sticker(msg) {
    if(msg.hasMedia || msg.hasQuotedMsg) {
        if(msg.hasQuotedMsg) {
            quoted_msg = await msg.getQuotedMessage()
            if(quoted_msg.hasMedia && quoted_msg.type == 'image') {
                const mime_type = quoted_msg._data.mimetype;
                const img_body = quoted_msg._data.body;
                const stickerMedia = await new MessageMedia(mime_type, img_body);
                msg.reply_sticker(stickerMedia);
            }
        } else {
            const receivedImage = await msg.downloadMedia();
            const stickerMedia = await new MessageMedia(receivedImage.mimetype, receivedImage.data);
            msg.reply(stickerMedia, msg._getChatId(), {sendMediaAsSticker: true});
        }
    }
}

module.exports = {
    main: sticker,
}
