'use-stric'
const dropdownloader = require('../lib/downloader/dropdownload');

async function downloader(msg) {
    try {
        if( msg.body.split(' ')[1] === undefined) {
            msg.reply(`*e.g: !downloader link*`); // supported file hosting:\n- https://drop.download/
            return;
        }
    
        const link_ = msg.body.split(' ')[1];
    
        if(link_.startsWith('https://drop.download/') || link_.startsWith('http://drop.download/')) {
            const link = await dropdownloader.dropdownloader(link_);
            if(link.startsWith(`https://`)) {
                msg.reply(`*direct link:* ${link}`);
                return;
            } else {
                msg.reply(`*error:* ${link}`);
                return;
            }
        } else {
            msg.reply(`*supported file hosting:*\n\n- https://drop.download/`)
        }
    } catch(e) {
        msg.reply(`*crash*\n\n${e.stack}`)
    }
}

module.exports = {
    main: downloader,
}