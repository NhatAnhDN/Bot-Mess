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
            if (/imgur\.com/.test(str)) {
                await send({
                    body: ` ===== auto upload =====`,
                    attachment: await streamURL(str, str.split('.').pop())
                });
            } else if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
                const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${str}`);
                await send({
                    body: `${head('pinterest')}- link: ${res.data.data.image.url}`,
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
