import fs from "fs";
import { join } from "path";

const config = {
  name: "phantich",
  permissions: [0],
  credits: "",
};

const traits = {
  t: ["Người đẹp không tổi", "Đéo biết tuổi gì", "Tuổi con ngan con", "Tuổi con cặc", "Tuổi con tép", "Tuổi mày bằng tuổi con tao", "Lồn"],
  tc: ["Tự tin", "Chầm tính", "Tự ti", "Khó tính", "Hiền lành", "Tính như lồn", "Người tình cảm", "Tham vọng", "Người cá tính", "Người lý trí", "Người trung thành", "Nhiệt tình", "Người mạnh mẽ", "Ôn hòa"],
  y: ["Tiền", "tình", "Gia đình", "Tình dục", "Yêu gì kệ mày tao đéo biết", "Màu hồng", "Động vật", "Công việc"],
  g: ["Nói dối", "Cục súc", "Nói nhiều", "Hãm lồn", "Tao đéo biết mày ghét gì", "Bạo lực", "Động vật", "Đông người", "Học", "Tình dục", "Người yêu cũ", "Giả dối"],
  mt: ["Quá Độc Lập", "Nói nhiều", "Làm không suy nghĩ", "Tiêu cực", "Suy nghĩ nhiều, linh tinh", "Không suy nghĩ cho bản thân", "Ki bo", "Khao khát bạo lực", "Ăn cắp vặt", "Thích đánh bạc"],
  ms: ["Vui vẻ", "Bình yên", "Nhây", "Nhoi", "Lầy", "Khiến người khác thoải mái", "Hay giúp đỡ người khác", "Đúng giờ", "Trung thành", "Tôn trọng người khác", "Giữ lời hứa", "Rộng lượng", "Đồng cảm"],
  bm: ["Body nóng bỏng", "Rất nhiều tiền", "Gay", "Nghèo vcl", "Bí mật quá tao đéo biết", "Người không biết giữ bí mật", "Học ngu", "Thiên tài", "Ăn nhiều"],
  tk: ["Là người có tâm hồn đẹp", "Con người phóng khoáng", "Xấu tính hay làm người khác khó chịu", "Con người không biết suy nghĩ", "Không biết trước biết sau"],
};

const surpriseGiftImage = "https://i.imgur.com/Kg4WDEy.jpg";
const randomImgrdImages = ["https://i.imgur.com/wg7mqK1.gif", "https://i.imgur.com/78ls6Wv.gif"];

async function getUserName(userID) {
  return new Promise((resolve, reject) => {
    global.api.getUserInfo(userID, (err, info) => {
      if (err) return reject(err);
      const userName = info[userID]?.name || `@${userID}`;
      resolve(userName);
    });
  });
}

function getRandomImage() {
  const selectedImage = randomImgrdImages[Math.floor(Math.random() * randomImgrdImages.length)];
  return selectedImage;
}

async function onCall({ message, args }) {
  let userID;
  if (message.type === "message_reply") {
    userID = message.messageReply.senderID;
  } else {
    userID = message.senderID;
  }

  const userName = await getUserName(userID);

  const randomImgrdImage = getRandomImage();
  const imageStream = await global.getStream(randomImgrdImage);

  function calculateTotalPoints() {
    const pointsPerCategory = {
      age: Math.floor(Math.random() * traits.t.length),
      personality: Math.floor(Math.random() * traits.tc.length),
      likes: Math.floor(Math.random() * traits.y.length),
      dislikes: Math.floor(Math.random() * traits.g.length),
      darkSide: Math.floor(Math.random() * traits.mt.length),
      brightSide: Math.floor(Math.random() * traits.ms.length),
      secrets: Math.floor(Math.random() * traits.bm.length),
      overall: 0,
    };

    pointsPerCategory.overall =
      pointsPerCategory.age +
      pointsPerCategory.personality +
      pointsPerCategory.likes +
      pointsPerCategory.dislikes -
      pointsPerCategory.darkSide -
      pointsPerCategory.secrets;

    pointsPerCategory.overall = Math.max(0, pointsPerCategory.overall);

    return pointsPerCategory;
  }

  const points = calculateTotalPoints();

  const responseMessage = `【PHÂN TÍCH AVATAR CỦA ${userName}】\n\n👽Tên: ${userName}\n🗓Tuổi: ${traits.t[points.age]} (+${points.age} điểm)\n🤖Tính cách: ${traits.tc[points.personality]} (+${points.personality} điểm)\n💗Yêu: ${traits.y[points.likes]} (+${points.likes} điểm)\n💀Ghét: ${traits.g[points.dislikes]} (+${points.dislikes} điểm)\n⬛Mặt tối: ${traits.mt[points.darkSide]} (-${points.darkSide} điểm)\n⬜Mặt sáng: ${traits.ms[points.brightSide]} (+${points.brightSide} điểm)\n🔐Bí mật: ${traits.bm[points.secrets]} (-${points.secrets} điểm)\n⚖Tổng kết: ${traits.tk[Math.floor(Math.random() * traits.tk.length)]} (${points.overall} điểm)`;

  await message.send({
    body: responseMessage,
    attachment: imageStream,
  });

  await new Promise(resolve => setTimeout(resolve, 2500));

  if (points.overall >= 20) {
    const messagesWithoutImages = [
      "Vì bạn có số điểm lớn hơn hoặc bằng 20 nên tôi có một món quà tặng bạn!",
      "1",
      "2",
      "3",
      "Chuẩn bị nè=))"
    ];

    for (const msg of messagesWithoutImages) {
      await message.send({
        body: msg,
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const surpriseGiftStream = await global.getStream(surpriseGiftImage);

    await message.send({
      body: "🎁 Bắt đầu gửi quà!",
      attachment: surpriseGiftStream,
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

export default {
  config,
  onCall,
};