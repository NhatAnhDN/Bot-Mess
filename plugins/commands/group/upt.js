import os from 'os';
import moment from 'moment-timezone';
import fs from 'fs';
const config = {
  name: "upt",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Vtuan",
  description: "Hiển thị thông tin hệ thống của bot",
  commandCategory: "Hệ Thống",
  usages: "",
  cooldowns: 5
};


function getStatusByPing(ping) {
  if (ping < 200) {
    return 'Tốt';
  } else if (ping < 800) {
    return 'Bình thường';
  } else {
    return 'Xấu';
  }
}
function getPrimaryIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1'; 
}

async function onCall({ message }) {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const uptime = process.uptime();
  const primaryIp = getPrimaryIP();
  const botStatus = getStatusByPing(Date.now() - message.timestamp);

  const uptimeHours = Math.floor(uptime / (60 * 60));
  const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  const uptimeString = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;

  // Formatted message including CPU and RAM details, similar to Replit's standards.
  const replyMsg = `
    𖢨 · Bây giờ là: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
    𖢨 · Thời gian đã hoạt động: ${uptimeString}
    𖢨 · Prefix mặc định: ${global.config.PREFIX}
    𖢨 · Địa chỉ IP: ${primaryIp}
    𖢨 · Tình trạng bot: ${botStatus}
    𖢨 · Thông tin hệ thống:
      - Hệ điều hành: ${os.type()} ${os.release()} (${os.arch()})
      - CPU: ${os.cpus().length} core(s) - ${os.cpus()[0].model.trim()} @ ${os.cpus()[0].speed}MHz
      - RAM: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB (Used/Total)
      - Dung lượng trống: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)}GB
    𖢨 · Ping: ${Date.now() - message.timestamp}ms
  `.trim();

  api.sendMessage(replyMsg, message.threadID, message.messageID);
};
export default {
  config,
  onCall
};
