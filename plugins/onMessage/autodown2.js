import axios from "axios";
import downloader from "image-downloader";
import { join } from "path";
import fs from "fs";
import moment from 'moment-timezone';
import FormData from 'form-data';
import ytdl from "ytdl-core";
export const config = {
    version: "2.2.0",
    description: "autodown",
    usage: '<url>',
    credits: "Nguyen blue",
};
const _48MB = 512 * 1024 * 1024;
const path = join(global.assetsPath, "statusAuto.json");
//code by nguyen blue vui lòng không xóa tôn trọng người làm ra
async function playVideo(message, video) {
  const { title, id, uploadDate, author, viewCount, likes } = video;
  message.react("⏳");
  const cachePath = join(global.cachePath, `_ytvideo${Date.now()}.mp4`);
  try {
    let stream = ytdl(id, { quality: 18 });
    stream.pipe(global.writer(cachePath));
    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });

    const stat = fs.statSync(cachePath);
    if (stat.size > _48MB) {
      message.reply("Video is too large, max size is 48MB");
    } else {
      await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
🎶=====「 𝐌𝐔𝐒𝐈𝐂 」=====️🎶
📌 → 𝗧𝗶𝘁𝗹𝗲: ${title}
⏳ → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝘅𝘂̛̉ 𝗹𝘆́: 00.1 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
[🦋] → Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 youtube 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 youtube`,
        attachment: global.reader(cachePath)
      });
    }
    message.react("✅");
  } catch (err) {
    message.react("❌");
    console.error(err);
    message.reply("An error occurred");
  }

  try {
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
  } catch (err) {
    console.error(err);
  }
}

async function getVideoInfo(url) {
  try {
    const videoId = ytdl.getURLVideoID(url);
    const info = await ytdl.getInfo(videoId);

    if (info && info.videoDetails) {
      return info;
    } else {
      console.error("Không thể lấy thông tin video.");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
const API = 'https://apidown.site'
const API_2 = 'https://api.uchihaobito.site'
const API_3 = 'https://nguyenmanh.name.vn'
const API_4 = 'https://kemapis.eu.org'
const API_5 = 'https://api.kaiyoteam.site'
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
  const regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//;
   const regEx_capcut = /^(http(s)?:\/\/(www\.)?capcut\.com\/t\/)/;
  const regEx_youtube =
    /(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//;
  const regEx_facebook =
    /(^https:\/\/)(\w+\.)?(facebook|fb)\.(com|watch)\/\w+\/\w?(\/)?/;
   const regEx_fb =
    /(^https:\/\/)(\w+\.)?(facebook|fb)\.(com|watch)\/\w+\/\w?(\/)?/;
  const regEx_instagram =
    /http(s|):\/\/(www\.)?instagram\.com\/(reel|p)\/\w+/;
 const regEx_ZingMp3 = /^(https?:\/\/)?(www.)?(m\.)?(mp3|zing)mp3\.vn\/bai-hat\/[\w\-\.]+\/\w+/;
const regEx_threads = /^https:\/\/www\.threads\.net\/@[^\/]+\/post\/[A-Za-z0-9]+$/;
const regEx_likee = /^https:\/\/(l\.)?likee\.video\/[sv]\/[A-Za-z0-9]+$/;
for (const el of arr) {
if (el.includes('www.snapchat.com') && el.includes('snapchat.com')) {
      const data_snapchat = (
        await axios.get(
         API + `/snapchat/download?link=` +
            el
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[👽] → username: ${data_snapchat.username}
[️🎐] → title: ${data_snapchat.title}
[🗒️] → mô tả: ${data_snapchat.Description}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 snapchat 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 snapchat
		`,
        attachment: await streamURL(data_snapchat.story.mediaUrl, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
if (regEx_likee.test(el)) {
      const data_likee = (
        await axios.get(
        API + `/likee/download?link=` +
            el
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 likee 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 likee
		`,
        attachment: await streamURL(data_likee.result.video_url.url, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
		if (regEx_threads.test(el)) {
      const data_threads = (
        await axios.get(
          API_5 + `/dwthreads?url=` +
            el
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 threads 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 threads
		`,
        attachment: await streamURL(data_threads.data.media[0].url, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
		if (regEx_ZingMp3.test(el)) {
      const datassst = (
        await axios.get(
          API_3 + `/api/zMp3DL?url=` +
            el + `&apikey=XykzBzqO`
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 âm thanh soundcloud 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 soundcloud
		`,
        attachment: await streamURL(datassst.result, "mp3"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }
  if (regEx_youtube.test(el)) {
    try {
      const videoInfo = await getVideoInfo(el);
      if (videoInfo) {
        const video = {
          title: videoInfo.videoDetails.title,
          id: videoInfo.videoDetails.videoId
        };
        await playVideo(message, video);
      } else {
        // Xử lý khi không lấy được thông tin video
      }
    } catch (err) {
      console.error(err);
    }
  }

if (regEx_tiktok.test(el)) {
  const datas = (
    await axios.get(
      API + `/api/tiktok/v1?link=` + el
    )
  ).data;

  message.react("⏳"); // Add loading hourglass reaction

  const imagesArray = datas.data.images;

  if (imagesArray && imagesArray.length > 0) {
    const numImagesToSend = Math.min(imagesArray.length, 99);

    let messageContent = "";
    let attachments = [];

    for (const imageUrl of imagesArray.slice(0, numImagesToSend)) {
      attachments.push(await streamURL(imageUrl, "jpeg"));
    }

    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨\n━━━━━━━━━━━━━━━━━━\n[👤] → Trạng thái: ${datas.msg}\n[🥀] → 𝗨𝗜𝗗:  ${datas.data.id}\n[🌍] → Quốc gia: ${datas.data.region}\n[❤️] → 𝗟𝘂̛𝗼̛̣𝘁 𝗧𝗵𝗶́𝗰𝗵: ${datas.data.digg_count}.\n[💬] → 𝗟𝘂̛𝗼̛̣𝘁 𝗯𝗶̀𝗻𝗵 𝗹𝘂𝗮̣̂𝗻: ${datas.data.comment_count}\n[🌐] → 𝗟𝘂̛𝗼̛̣𝘁 𝗰𝗵𝗶𝗮 𝘀𝗲̉: ${datas.data.share_count}\n[📺] → 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗮̉𝗶: ${datas.data.download_count}\n[🎐] → title - ${datas.data.title}\n━━━━━━━━━━━━━━━━━━\n[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${datas.processed_time} 𝗴𝗶𝗮̂𝘆\n━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
[🦋] → Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼/ảnh 𝘁𝗶𝗸𝘁𝗼𝗸 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 𝘁𝗶𝗸𝘁𝗼𝗸`,
      attachment: attachments,
    });

    message.react("✅"); // Add success checkmark reaction
  } else {
    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨\n━━━━━━━━━━━━━━━━━━\n[👤] → Trạng thái: ${datas.msg}\n[🥀] → 𝗨𝗜𝗗:  ${datas.data.id}\n[🌍] → Quốc gia: ${datas.data.region}\n[❤️] → 𝗟𝘂̛𝗼̛̣𝘁 𝗧𝗵𝗶́𝗰𝗵: ${datas.data.digg_count}.\n[💬] → 𝗟𝘂̛𝗼̛̣𝘁 𝗯𝗶̀𝗻𝗵 𝗹𝘂𝗮̣̂𝗻: ${datas.data.comment_count}\n[🌐] → 𝗟𝘂̛𝗼̛̣𝘁 𝗰𝗵𝗶𝗮 𝘀𝗲̉: ${datas.data.share_count}\n[📺] → 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗮̉𝗶: ${datas.data.download_count}\n[🎐] → title - ${datas.data.title}\n━━━━━━━━━━━━━━━━━━\n[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${datas.processed_time} 𝗴𝗶𝗮̂𝘆\n━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
[🦋] → Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼/ảnh 𝘁𝗶𝗸𝘁𝗼𝗸 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 𝘁𝗶𝗸tok`,
      attachment: await streamURL(datas.data.play, "mp4"),
    });

    message.react("✅"); // Add success checkmark reaction
  }
}
if (regEx_instagram.test(el)) {
  try {
    const datans = (
      await axios.get(
        API + `/api/instagram/v1?link=` + el
      )
    ).data;

    message.react("⏳"); // Add loading hourglass reaction

    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[🗒️] → Mô tả: ${datans[0].title}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ đây là tính năng tự động download Video/ảnh từ Instagram`,
      attachment: await streamURL(datans[0].link, datans[0].type),
    });

    message.react("✅"); // Add success checkmark reaction
  } catch (error) {
    console.error("Error processing Instagram link:", error);
    // Handle error - perhaps send a message to notify the user or log the error
  }
}

	if (regEx_capcut.test(el)) {
      const datasss = (
        await axios.get(
          API + `/api/capcut/v1?link` +
            el
        )
      ).data;
 message.react("⏳"); // Add loading hourglass reaction
      const _newMessage = await message.reply({
        body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
[👀] → Usage: ${datasss.usage}
[🎐] → Title: ${datasss.title}
[🗒️] → Mô tả: ${datasss.description}
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 capcut 𝗸𝗵𝗼̂𝗻𝗴 𝗹𝗼𝗴𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 capcut
		`,
        attachment: await streamURL(datasss.video, "mp4"),
      });
	  message.react("✅"); // Add success checkmark reaction
    }


// Define the function to fetch the stream from URL
async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

if (regEx_facebook.test(el)) {
  const data = (await axios.get(API + `/fb/download?link=${el}`)).data;

  const videoSizeInMB = data.size / (1024 * 1024);
  const videoDurationInSeconds = data.duration;

  if (videoSizeInMB > 108 || videoDurationInSeconds > 3600) {
    // Respond in a different way, e.g., send a text or do nothing
    // You can customize this part based on your requirements
    return;
  }

  async function upload(url) {
    let attempts = 3; // Number of retry attempts

    while (attempts > 0) {
      try {
        const formData = new FormData();
        formData.append('upload_1024', await getStreamFromURL(url));

        const uploadvideo = await axios.post('https://upload.facebook.com/ajax/mercury/upload.php', formData, {
          headers: {
            ...formData.getHeaders(), // Use formData directly to get headers
          },
        });

        const metadata = uploadvideo.data.payload?.metadata?.[0] || {};
        return Object.entries(metadata)[0];
      } catch (uploadError) {
        console.error("Error uploading video:", uploadError);
        attempts--;

        if (attempts === 0) {
          // If retries are exhausted, handle the error in a different way
          throw uploadError;
        }

        // Wait for a short delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  const send = async msg => {
    new Promise(r => global.api.sendMessage(msg, message.threadID, (err, res) => r(res || err), message.messageID));
  };

  message.react("⏳");

  try {
    const [attachmentUrl] = await Promise.all([
      streamURL(data.facebookResults.result.sd_q, "mp4"),
      upload(data.facebookResults.result.sd_q), // Upload video and get attachment URL
      // Add any other asynchronous operations here if needed
    ]);

    const _newMessage = await message.reply({
      body: `
🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨
━━━━━━━━━━━━━━━━━━
[👤] → Trạng thái: success
[🌍] → Quốc gia: Vietnam
━━━━━━━━━━━━━━━━━━
[⌛] → 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${randomNumbers} 𝗴𝗶𝗮̂𝘆
━━━━━━━━━━━━━━━━━━
[🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
➜ Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘂𝗿𝗹 Facebook`, // Change the response to "uploadvideonhanh"
      attachment: attachmentUrl,
    });

    message.react("✅");
  } catch (error) {
    console.error("Error sending video:", error);
    // Handle the error in a different way, e.g., log it or send an alternative message
  }
}
//if (regEx_fb.test(el)) {
    //  const datasccc = (
      //    await axios.get(
    //          API_4 + "/api/facebook/convert?url=" + el
     //     )
    //  ).data;

    //  message.react("⏳"); // Add loading hourglass reaction

      //  const attachments = datasccc.attachment;

    //    if (attachments && attachments.length > 0) {
      //      const uniqueImageUrlsSet = new Set(); // Set to store unique image URLs
         //   const imageResults = []; // Array to store processed images

          //  for (const attachment of attachments) {
             //   const imageUrl = attachment.image.uri;

              // Check if the URL is unique, if not, skip processing
                //if (uniqueImageUrlsSet.has(imageUrl)) {
                   // console.log("Skipping duplicate image:",   //imageUrl);
                 //   continue;
         //     }

            //  uniqueImageUrlsSet.add(imageUrl); // Add the URL to the set

             // const imageResult = await streamURL(imageUrl, "jpeg");
       //       if (imageResult) {
            //      imageResults.push(imageResult);
       //       }
        //  }

        //  const numberOfImages = imageResults.length; // Get the number of unique images

        //  if (numberOfImages > 0) {
            //  const _newMessage = await message.reply({
       //           body: `
     //         🥨==『 𝗔𝗨𝗧𝗢𝗗𝗢𝗪𝗡 』==🥨\n━━━━━━━━━━━━━━━━━━
         //         [${datasccc.message}]
            //      [🕓] → Thời gian hiện tại: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
              //    [🦋] → Đ𝐚̂𝘆 𝗹𝗮̀ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 tự đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 ${numberOfImages} ảnh facebook khi phát hiện liên kết`,
          //        attachment: imageResults,
          //    });

              //message.react("✅"); // Add success checkmark reaction
      //    } else {
        //     message.react("❌"); // Add failure "❌" reaction
       //   }
   //   }
  //}
  }
}

