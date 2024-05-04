const config = {
  name: "duathu",
  aliases: [""],
  description: "gửi tin nhắn ẩn danh đến người khác",
  usage: "duathu [USER_ID] [Tin Nhắn]",
  cooldown: 3,
  permissions: [2],
  credits: "",
};

async function sendMessageToUser(message, content, userID, userName) {
  try {
    const mention = `${userName}`;
    const fullText = `Chào ${mention} ${content}`;
    await message.send(fullText, userID);
    await timeout(2000);
  } catch (error) {
    console.error(`Lỗi khi gửi tin nhắn đến người dùng ${userID}: ${error.message}`);
    throw error;
  }
}

async function onCall({ message, args }) {
  try {
    if (!args[0]) {
      return message.reply("Vui lòng cung cấp ID người dùng mục tiêu.");
    }

    const userID = args[0];

    try {
      const userInfo = await global.api.getUserInfo([userID]);
      const userName = userInfo[userID].name;

      await message.send(
        `Bot bắt đầu gửi tin nhắn cho người dùng:\n${userName} - ${userID}`
      );

      const content = `mình là bot đưa thư, có một người ẩn danh nhờ mình gửi điều này đến bạn 💌\n\nNội Dung: ${args.slice(1).join(" ")} 💭\n\nChúc bạn một ngày vui vẻ 💞`;

      await sendMessageToUser(message, content, userID, userName);

      return message.reply(`Gửi tin nhắn ẩn danh đến người ấy thành công`);
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin người dùng với ID ${userID}:`, error);
      message.send(
        `Đã xảy ra lỗi khi lấy thông tin người dùng với ID ${userID}. Vui lòng thử lại sau.`
      );
      return;
    }
  } catch (error) {
    console.error(`Lỗi trong hàm onCall: ${error.message}`);
    throw error;
  }
}
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  config,
  onCall,
};