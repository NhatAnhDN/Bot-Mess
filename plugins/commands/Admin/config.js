const config = {
  name: "config",
  version: "1.0.0",
  aliases: [""],
  description: "Chỉnh sửa cài đặt",
  permissions: [2],
  credits: ""
}
function truefalseconvertText(status) {
  const str_v = '✅';
  const str_x = '❌';
  if (status === true) {
    return str_v;
  } else {
    return str_x;
  }
}
async function onCall( {
  args, message, eventData
}) {
  const str = `Để chỉnh sửa prefix thì hãy dùng lệnh ${global.config.PREFIX}config prefix [prefix mới]\n• Để chỉnh sửa tên bot dùng lệnh này: ${global.config.PREFIX}config name [Tên mới của bot]\n`;
  const select = args[0]?.toLowerCase();
  switch (select) {
    case 'prefix':
      try {
        if (args[1] === "noprefix") {
          global.config.PREFIX = " ";
          global.config.save();
          message.reply("Đã bật chế độ không dùng prefix");
        } else {
          global.config.PREFIX = args[1];
          global.config.save();
          message.reply(`Thay đổi thành công\nPrefix mới của bạn là: ${args[1]}`);
        }
      }
      catch(e) {
        message.reply(`[CODE-140] Hệ thống gặp sự cố không xác định! Vui lòng liên hệ admin để biết thêm chi tiết`);
        console.log(`[CODE-140] Hệ thống gặp lỗi:${e}`);
      }
      break;
    case 'name':
      try {
        const newName = args.slice(1).join(' ');
        global.config.NAME = newName;
        global.config.save();
        message.reply(`Thay đổi tên mặc định của Bot thành công\nP/S: Khi thêm vào box mới bot sẽ update tên mới là: ${newName}`)
      }catch(e) {
        message.reply('[CODE-141] hệ Thống gặp sự cố không xác định!Vui lòng liên hệ admin để biết thêm chi tiết');
      }
      break;
  
    case 'options':
      const str_options = ` Dưới đây là những thiết lập hệ thống hiện tại\n \n${
      truefalseconvertText(global.config.CHJIX_WAR_OPTIONS.LISTEN_CONSOLE)} 1. [LISTEN_CONSOLE] Hiển thị listen trên console\n\n${
      truefalseconvertText(global.config.CHJIX_WAR_OPTIONS.WEBVIEW)} [WEBVIEW] Sử dụng Webview để UPTIME\n\n${
      truefalseconvertText(global.config.CHJIX_WAR_OPTIONS.NOTIFICATION_DISPLAY)} 3.[NOTIFICATION_DISPLAY] Hiển thị thông báo từ admin`
      const options_select = args[1];
      switch (options_select) {
      case 'listen_console':
        if (args[2]?.toLowerCase() == 'on') {
          global.config.CHJIX_WAR_OPTIONS.LISTEN_CONSOLE = true;
          global.config.save();
        } else {
          global.config.CHJIX_WAR_OPTIONS.LISTEN_CONSOLE = false;
          global.config.save();
        }
        await message.reply('Thiết lập thành công ! Hệ thống đang khởi động lại...');
        global.restart();
        break;
      case 'notification_display':
        if (args[2].toLowerCase() == 'on') {
          global.config.CHJIX_WAR_OPTIONS.notification_display = true;
          global.config.save();
        } else {
          global.config.CHJIX_WAR_OPTIONS.NOTIFICATION_DISPLAY = false;
          global.config.save();
        }
        await message.reply('Thiết lập thành công ! Hệ thống đang khởi động lại...');
        global.restart();
        break;
      default:
        message.reply(str_options);
        break;
      }
      break;
    default:
      message.send(str)
      break;
  }
}
export default {
  config,
  onCall
}