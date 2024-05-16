import axios from 'axios';
import fs from 'fs';
import { join } from "path";
export const config = {
    version: "1.0.0",
    description: "autoimg",
    usage: '<url>',
    credits: "Nguyen blue",
};
const isURL = u => /^http(|s):\/\//.test(u);

export default async function ({ message, args }) {
    try {
        const str = message.body;
        const send = async msg => {
            await global.api.sendMessage(msg, message.threadID);
            // Add loading hourglass reaction after sending the message
            message.react("✅");
        };
        const head = app => `${app.toUpperCase()} title:\n\n`;

        if (isURL(str)) {
            if (/facebook\.com/.test(str)) {
                await send({
                    body: ` ===== auto upload =====`,
                    attachment: await streamURL(str, str.split('.').pop())
                });
            } else if (/(^https:\/\/)((www)\.)?(facebook|fb)*\.(com)\//.test(str)) {
                const res = await axios.get(`https://sumiproject.io.vn/facebook/video?url=${str}`);
                await send({
                    body: `
🐧==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🐧
━━━━━━━━━━━━━━━━━━
🎶=====「 Facebook 」=====️🎶
⏳ → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝘅𝘂̛̉ 𝗹𝘆́: 00.1 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
[🦋] → Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 youtube 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 youtube`,
                    attachment: await streamURL(res.data.data.image.url, 'jpg')
                });
            }
        }
    } catch (e) {
        console.log('Error', e);
    }
}

function streamURL(url, type) {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        const path = join(global.assetsPath, `${Date.now()}.${type}`);
        fs.writeFileSync(path, res.data);
        setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
        return fs.createReadStream(path);
    });
}
