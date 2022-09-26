'use stric'
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

let position_1;
let position_2;
let position_3;
let position_4;
let retry = 0;
let max_retry = 3;

function html_decoder(key) {
    const digitObj = new Object();
    digitObj['&#48;'] = 0; digitObj['&#49;'] = 1; digitObj['&#50;'] = 2; digitObj['&#51;'] = 3; digitObj['&#52;'] = 4; digitObj['&#53;'] = 5; digitObj['&#54;'] = 6; digitObj['&#55;'] = 7; digitObj['&#56;'] = 8; digitObj['&#57;'] = 9;
    return digitObj[key];
}

function fix_position(pad, key) {
    if(parseInt(pad) < 13) {
        position_1 = html_decoder(key).toString();
        return;
    }
    if(parseInt(pad) < 35) {
        position_2 = html_decoder(key).toString();
        return;
    }
    if(parseInt(pad) < 50) {
        position_3 = html_decoder(key).toString();
        return;
    }
    if(parseInt(pad) > 60) {
        position_4 = html_decoder(key).toString();
        return;
    }
}

async function dropdownloader(url) {
    const x = await client.get(url);

    if(!x.data.includes(`value="Free Download >>"`) || x.data.includes(`File Not Found`)) {
        return `File Not Found`;
    }

    let jsonObj = new URLSearchParams();
    const reader = x.data;
    const op = /<input .* name=\"op\" value=\"(.*?)\">/gm.exec(reader)[1];
    const usr_login = /<input .* name=\"usr_login\" value=\"(.*?)\">/gm.exec(reader)[1];
    const id = /<input .* name=\"id\" value=\"(.*?)\">/gm.exec(reader)[1];
    const fname = /<input .* name=\"fname\" value=\"(.*?)\">/gm.exec(reader)[1];
    const referer = /<input .* name=\"referer\" value=\"(.*?)\">/gm.exec(reader)[1];

    jsonObj.append('op',  op);
    jsonObj.append('usr_login',  usr_login);
    jsonObj.append('id',  id);
    jsonObj.append('fname',  fname);
    jsonObj.append('referer',  referer);
    jsonObj.append('method_free',  "Free Download >>");

    const z = await client.post(url, jsonObj);
    const captcha = /<td align=right><div style=\'width:80px;height:26px;font:bold 13px Arial;background:#ccc;text-align:left;direction:ltr;\'>(.*?)<\/div><\/td>/gm.exec(z.data)[1];
    const c1 = /<span style.*padding-left\:(.*?)px.*\'>(.*?)</gm.exec(captcha.split('</span>')[0]+'</span>');
    fix_position(c1[1], c1[2]);
    const c2 = /<span style.*padding-left\:(.*?)px.*\'>(.*?)</gm.exec(captcha.split('</span>')[1]+'</span>');
    fix_position(c2[1], c2[2]);
    const c3 = /<span style.*padding-left\:(.*?)px.*\'>(.*?)</gm.exec(captcha.split('</span>')[2]+'</span>');
    fix_position(c3[1], c3[2]);
    const c4 = /<span style.*padding-left\:(.*?)px.*\'>(.*?)</gm.exec(captcha.split('</span>')[3]+'</span>');
    fix_position(c4[1], c4[2]);
    
    const fixed_captcha = `${position_1}${position_2}${position_3}${position_4}`

    const page_id = /<input .* name=\"id\" value=\"(.*?)\">/gm.exec(z.data)[1];
    const rand = /<input .* name=\"rand\" value=\"(.*?)\">/gm.exec(z.data)[1];
    const page_referer = /<input .* name=\"referer\" value=\"(.*?)\">/gm.exec(z.data)[1];
    let data2 = new URLSearchParams();
    data2.append("op", 'download2');
    data2.append("id", page_id);
    data2.append("rand", rand);
    data2.append("referer", page_referer);
    data2.append("method_premium", '');
    data2.append("method_free", "Free Download >>");
    data2.append("adblock_detected", 0);
    data2.append("code", parseInt(fixed_captcha));
    
    const final = await client.post(url, data2);
    try {
        const link = /href="(.*?)" class="btn-download/gm.exec(final.data)[1];
        if(!link) {
            retry += 1;
            return await dropdownloader(url);
        }
        return link;
    } catch {
        if(retry == max_retry) {
            retrun `can't get direct link`;
        } else {
            retry += 1;
            return await dropdownloader(url);
        }
    }
}

module.exports = {
    dropdownloader: dropdownloader
}