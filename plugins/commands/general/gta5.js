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
  en_US: {
    missingInput: "Please enter text",
    notFound: "No results found",
    error: "An error occurred!",
    missingData: "Insufficient data to launch the program",
  },
  ar_SA: {
    missingInput: "يرجى إدخال النص",
    notFound: "لم يتم العثور على نتائج",
    error: "حدث خطأ!",
    missingData: "بيانات غير كافية لتشغيل البرنامج",
  },
};

async function onCall({ message, args, getLang }) {
  try {
    const input = args.join(" ");
    if (!input) return message.reply(getLang("missingInput"));
    const linkimg = encodeURIComponent(input);
    const res = await global.GET(
      `https://sumiproject.io.vn/gta5?url=${linkimg}&apikey=apikeysumi`
    );
    const apiData = res.data;
    if (!apiData) return message.reply(getLang("notFound"));
    if (apiData.error) return message.reply(getLang("missingData"));

    const { result_url, duration } = apiData.data;
    if (!result_url || !duration) return message.reply(getLang("notFound"));

    const responseMessage = `
[Ả𝐧𝐡 𝐆𝐓𝐀]\n=>Tổng thời gian xử lí: ${duration}`;
    await message.reply(responseMessage);

    const imageStream = await global.getStream(result_url);
    await message.send({
      attachment: [imageStream]
    });
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
