import Jimp from 'jimp';
import { writeFileSync } from 'fs';
import { join } from 'path';

const config = {
   name: "bopmong",
   description: "bopmong banner with a user",
   usage: "<@mention/reply>",
   credits: "XaviaTeam",
   cooldown: 5
}

async function makeImage(data) {
   const { savePath, avatarPathOne, avatarPathTwo } = data;

   try {
      const template = await Jimp.read('https://i.postimg.cc/mkx4rC8N/detail-2.gif');

 const avatarOne = await Jimp.read(avatarPathOne);
  const avatarTwo = await Jimp.read(avatarPathTwo);

  avatarOne.circle();
  avatarTwo.circle();

  avatarOne.resize(110, 110);
  avatarTwo.resize(110, 110);

  template.composite(avatarOne, 270, 95);
  template.composite(avatarTwo, 60, 90);

      await template.writeAsync(savePath);
      return true;
   } catch (e) {
      console.error(e);
      return false;
   }
}

const langData = {
   "en_US": {
      "missingTarget": "Please mention/reply to a user",
      "loveMessage": "Together till the end of time <3"
   },
   "vi_VN": {
      "missingTarget": "Vui lòng tag hoặc reply một người dùng",
      "loveMessage": "Mong mềm vậy em yew 😍 <3"
   }
}

async function onCall({ message, getLang }) {
   const { type, messageReply, mentions, senderID } = message;
   let savePath, avatarPathOne, avatarPathTwo;
   try {
      let targetID = type == 'message_reply' ? messageReply.senderID : Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;

      if (targetID == senderID) return message.reply(getLang('missingTarget'));

      const selfData = await global.controllers.Users.get(senderID);
      if (!selfData || !selfData.info || !selfData.info.thumbSrc) return;

      const targetData = await global.controllers.Users.get(targetID);
      if (!targetData || !targetData.info || !targetData.info.thumbSrc) return;

      savePath = join(global.cachePath, `love_${targetID}_${Date.now()}.png`);
      avatarPathOne = join(global.cachePath, `rank_avatar_${senderID}_${Date.now()}.jpg`);
      avatarPathTwo = join(global.cachePath, `rank_avatar_${targetID}_${Date.now()}.jpg`);
      await global.downloadFile(avatarPathOne, selfData.info.thumbSrc);
      await global.downloadFile(avatarPathTwo, targetData.info.thumbSrc);

      let result = await makeImage({ savePath, avatarPathOne, avatarPathTwo });

      if (!result) message.reply("Error");
      else await message.reply({ body: getLang("loveMessage"), attachment: global.reader(savePath) });

   } catch (e) {
      console.error(e);
      message.reply("Error");
   }

   cleanup(savePath, avatarPathOne, avatarPathTwo);
}

function cleanup(savePath, avatarPathOne, avatarPathTwo) {
   try {
      if (global.isExists(savePath)) global.deleteFile(savePath);
      if (global.isExists(avatarPathOne)) global.deleteFile(avatarPathOne);
      if (global.isExists(avatarPathTwo)) global.deleteFile(avatarPathTwo);
   } catch (e) {
      console.error(e);
   }
}

export default {
   config,
   langData,
   onCall
}