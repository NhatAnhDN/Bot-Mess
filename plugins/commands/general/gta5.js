const config = {
  name: "gta5",
  credits: "NhatAnh",
  cooldown: 5,
};

const langData = {
  vi_VN: {
    missingInput: "Vui lòng nhập text",
    notFound: "Không tìm thấy kết quả",
    error: "Đã có lỗi xảy ra!",
    missingData: "Thiếu dữ liệu để khởi chạy chương trình",
  },
};

async function onCall({ message, args, getLang }) {
  try {
    const input = args.join(" ");
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const res = await global.GET(
      `https://sumiproject.io.vn/gta5?url=${encodedInput}&apikey=apikeysumi`
    );
    const apiData = res.data;
    if (!apiData) return message.reply(getLang("notFound"));
    if (apiData.error) return message.reply(getLang("missingData"));

    const { result_url, duration } = apiData.data;
    if (!result_url || !duration) return message.reply(getLang("notFound"));

    const responseMessage = `Result URL: ${result_url}\nDuration: ${duration}`;
    return message.reply(responseMessage); 
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
