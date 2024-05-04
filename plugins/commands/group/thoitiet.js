import axios from 'axios';

export const config = {
  name: "thoitiet",
  credits: "nguyen blue ",
  description: "Xem thông tin thời tiết",
  commandCategory: "Nhóm",
  usage: "[tag/reply/id]",
  cooldowns: 5
};

export async function onCall({ message, args }) {
  try {
    const location = args.join(" ");

    if (!location) {
      message.reply("Nhập tỉnh/tp cần xem thời tiết");
      return;
    }

    const response = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURI(location)}`);
    const weatherData = response.data[0].current;

    message.reply({
      body: `
        →『📌』𝗰𝗮̣̂𝗽 𝗻𝗵𝗮̣̂𝘁 𝘁𝗵𝗼̛̀𝗶 𝘁𝗶𝗲̂́𝘁 𝘁𝗮̣𝗶: ${response.data[0].location.name}
        →『⏰』𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${weatherData.day} ${weatherData.date}
        →『🌡️』𝗡𝗵𝗶𝗲̣̂𝘁 đ𝗼̣̂: ${weatherData.temperature}°${response.data[0].location.degreetype}
        →『📋』𝗠𝗼̂ 𝘁𝗮̉: ${weatherData.skytext}
        →『☁️』đ𝗼̣̂ 𝗮̂̉𝗺: ${weatherData.humidity}
        →『💨』𝗛𝘂̛𝗼̛́𝗻𝗴 𝗴𝗶𝗼́: ${weatherData.winddisplay}
        →『📥』𝗚𝗵𝗶 𝗻𝗵𝗮̣̂𝗻 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${weatherData.observationtime} 
      `
    });
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu đến API:', error);
    message.reply(`Đã xảy ra lỗi khi gửi yêu cầu đến API.`);
  }
}
