import {
  resolve as resolvePath
} from 'path';
import fs from 'fs';
const config = {
  name: "appstate",
  aliases: ["appstate",
    "newappstate",
    "cookie"],
  permissions: [2],
  description: "Làm mới appstate",
  usage: "<script>",
  credits: "",
  isAbsolute: true
}

function onCall( {
  message, args
}) {
  const appstate = JSON.stringify(global.api.getAppState());
  fs.writeFileSync(resolvePath(global.mainPath, global.config.APPSTATE_PATH), appstate);
  message.reply("ĐÃ LÀM MỚI APPSTATE 🐧");
}

export default {
  config,
  onCall
}