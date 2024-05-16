const config = {
  name: "gpt",
  credits: "",
  cooldown: 5,
};

const langData = {
  vi_VN: {
    missingInput: "Vui lòng nhập text",
    notFound: "Không tìm thấy kết quả",
    error: "Đã có lỗi xảy ra!",
  },
};

async function onCall({ message, args, getLang }) {
  try {
    const input = args.join(" ");
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const res = await global.GET(
      `https://apichatbot.sumiproject.io.vn/gpt4?q=${encodedInput}`
    );
    const apiData = res.data;
    if (!apiData) return message.reply(getLang("notFound"));
    const responseData = apiData.data; // Lấy thông tin từ thuộc tính "data"
    if (!responseData) return message.reply(getLang("notFound"));
    return message.reply(responseData); // Trả về thông tin lấy được từ API
  } catch (e) {
    console.error(e);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
