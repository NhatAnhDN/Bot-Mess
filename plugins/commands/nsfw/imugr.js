import axios from 'axios';

const config = {
  name: "upload",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "Hệ thống",
  usages: "+ link wed",
  cooldowns: 5
};

async function onCall({ message }) {
  const { threadID, type, messageReply, messageID } = message;
  const clientId = "c76eb7edd1459f3";

  if (type !== "message_reply" || messageReply.attachments.length === 0) {
    return api.sendMessage("Bạn phải reply một video, ảnh nào đó", threadID, messageID);
  }

  const attachmentSend = [];

  async function getAttachments(attachments) {
    for (const data of attachments) {
      attachmentSend.push({
        url: data.url,
        type: data.type, // 'photo' cho ảnh, 'video' cho video
      });
    }
  }

  await getAttachments(messageReply.attachments);
  let msg = "", Success = 0, Error = [];

  for (const attachment of attachmentSend) {
    try {
      if (attachment.type === 'photo') {
        // Tải lên ảnh
        const response = await axios.post(
          'https://api.imgur.com/3/image/',
          { image: attachment.url },
          { headers: { Authorization: `Client-ID ${clientId}` } }
        );
        const getLink = response.data.data;
        console.log(getLink);
        msg += `${++Success}/ ${getLink.link}\n`;
      } else if (attachment.type === 'video') {
        // Đối với video, bạn có thể cần tải lên dịch vụ khác (ví dụ: YouTube) và chia sẻ liên kết
        msg += `Video không được hỗ trợ trực tiếp. Vui lòng tải lên dịch vụ lưu trữ video và chia sẻ liên kết.\n`;
      }
    } catch (err) {
      console.error(err);
      Error.push(attachment.url);
    }
  }

  return api.sendMessage(`[ 𝗜𝗠𝗚𝗨𝗥 𝗨𝗣𝗟𝗢𝗔𝗗 ]\n➝ 𝗧𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴: ${Success}\n➝ 𝗧𝗵𝗮̂́𝘁 𝗯𝗮̣𝗶: ${Error.length}\n⊱ ⋅ ━━━━━━━━━━━━━━━━━━ ⋅ ⊰\n${msg}`, threadID);
}

export default {
  config,
  onCall
};
