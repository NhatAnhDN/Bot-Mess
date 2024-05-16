import axios from "axios";
import downloader from "image-downloader";
import { join } from "path";
import fs from "fs";
import moment from 'moment-timezone';

export const config = {
    version: "2.2.0",
    description: "autodown",
    usage: '<url>',
    credits: "Nguyen blue",
};

const path = join(global.assetsPath, "statusAuto.json");

const API = 'http://localhost:8080'
const API_2 = 'https://api.uchihaobito.site'
const API_3 = 'https://nguyenmanh.name.vn'
const API_4 = 'https://kemapis.eu.org'

async function streamURL(url, mime) {
  const dest = `${global.cachePath}/${Date.now()}.${mime}`;
  await downloader.image({
    url,
    dest,
  });
  setTimeout((j) => fs.unlinkSync(j), 60 * 1000, dest);
  return fs.createReadStream(dest);
}

async function downImg(datas, is_text_only) {
  let imageData = [],
    num = 0,
    cache = [];
  if (!datas) return;
  if (is_text_only) {
    var link = datas.split(`[`)[1].split(`]`)[0];
    let datass = (await axios.get(`${link}`, { responseType: "arraybuffer" }))
      .data;
    fs.writeFileSync(
      `${global.cachePath}` + "/" + `1.jpg`,
      Buffer.from(datass, "utf-8")
    );
    imageData.push(fs.createReadStream(`${global.cachePath}` + "/" + `1.jpg`));
    return imageData;
  }
  for (const e of datas) {
    let ext = "jpg";
    //  console.log('1')
    let path = `${global.cachePath}` + `/${(num += 1)}.${ext}`;
    cache.push(path);
    let data = (await axios.get(`${e}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imageData.push(
      fs.createReadStream(`${global.cachePath}` + "/" + `${num}.${ext}`)
    );
  }
  return imageData;
}
// Generate a random number between 1 and 10 (inclusive)
const randomNumbers = Math.floor(Math.random() * 10) + 1;
const API_KEY_MIXCLOUD = 'jddAywUs';


export default async function ({ message, args }) {
  const s = JSON.parse(fs.readFileSync(path));
  if (message.senderID == global.botID) return;
  if (typeof s[message.threadID] == "boolean" && !s[message.threadID]) return;
  const out = (a, b, c, d) =>
    global.api.sendMessage(
      a,
      b ? b : message.threadID,
      c ? c : null,
      d ? d : message.messageID
    );

  const arr = message.args;
  const regEx_SCC = /^(https?:\/\/)?(www\.|on\.)?soundcloud\.com\/[\w\-\.\/]+$/;
const regEx_SC = /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+/;
 const regEx_SPotify = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/;
const regEx_Twitter = /^https:\/\/twitter\.com\/\w+\/status\/\d+$/;
const regEx_StickerPack = /^https:\/\/getstickerpack\.com\/stickers\/[\w-]+$/;
const regEx_Kuaishou = /^https:\/\/v\.kuaishou\.com\/[a-zA-Z0-9]+$/;


for (const el of arr) {


	

			if (regEx_Kuaishou.test(el)) {
      const datashou = (
        await axios.get(
          API_3 + `/api/kuaishou?url=` +
            el + `&apikey=jddAywUs`
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[️🗒️] → title: ${datashou.result.photo.caption}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 video Kuaishou 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 Kuaishou
		`,
        attachment: await streamURL(datashou.result.videonowatermark, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
	if (el.includes('https://getstickerpack.com/') && el.includes('/stickers')) {
  const datasy = (
    await axios.get(
      API_3 + `/api/stickerpackDL?url=` +
            el + `&apikey=jddAywUs`
    )
  ).data;

  message.react("⏳"); // Add loading hourglass reaction

  const imagesArray = datasy.result.result;

  if (imagesArray && imagesArray.length > 0) {
    const numImagesToSend = Math.min(imagesArray.length, 20);

    let messageContent = "";
    let attachments = [];

    for (const imageUrl of imagesArray.slice(0, numImagesToSend)) {
      attachments.push(await streamURL(imageUrl, "jpeg"));
    }

    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[️] → title: ${datasy.result.title}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 ảnh StickerPack 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 StickerPack
		`,
      attachment: attachments,
    });

    message.react("✅"); // Add success checkmark reaction
}
	}
			if (regEx_Twitter.test(el)) {
      const datasxst = (
        await axios.get(
          API_3 + `/api/twitterDL?url=` +
            el + `&apikey=jddAywUs`
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[️] → title: ${datasxst.result.desc}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 video Twitter 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 Twitter
		`,
        attachment: await streamURL(datasxst.result.HD, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
				if (regEx_SPotify.test(el)) {
      const datassxst = (
        await axios.get(
          API_3 + `/api/spDL?url=` +
            el + `&apikey=jddAywUs`
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[️] → title: ${datassxst.result.name}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 âm thanh SPotify 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 SPotify
		`,
        attachment: await streamURL(datassxst.result.preview_audio, "mp3"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
  // Check if the Mixcloud URL contains the expected patterns
  if (el.includes('https://www.mixcloud.com/') && el.includes('/')) {
    const dataststt = (
      await axios.get(
        `${API_3}/api/mixcloud?url=${encodeURIComponent(el)}&apikey=${API_KEY_MIXCLOUD}`
      )
    ).data;

    // Display loading reaction
    message.react("⏳");

    const randomNumbers = Math.floor(Math.random() * 10) + 1;

    const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY');

    // Display success message with information
    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${currentTime}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 âm thanh Mixcloud
		`,
      attachment: await streamURL(dataststt.result, "m4a"),
    });

    // Display success checkmark reaction
    message.react("✅");
  }
    if (regEx_SC.test(el) || regEx_SCC.test(el)) {
      const datasssst = (
        await axios.get(
          API_3 + `/api/scDL?url=` +
            el + `&apikey=jddAywUs`
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[🎐] → created_at: ${moment(datasssst.result.created_at).format('HH:mm:ss')} || ${moment(datasssst.result.created_at).format('DD/MM/YYYY')}
[🗒️] → title: ${datasssst.result.title}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 âm thanh soundcloud 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 soundcloud
		`,
        attachment: await streamURL(datasssst.result.audio, "mp3"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
    
  }
}
