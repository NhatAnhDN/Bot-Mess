import os from 'os';
import moment from 'moment-timezone';

import fsExtra from 'fs-extra';
import axios from 'axios';

const config = {
  name: "hoatdong",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Vtuan (nguyen blue convert)",
  description: "Hiển thị thông tin hệ thống của bot",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5
};

async function getDependencyCount() {
  try {
    await fsExtra.access('package.json');
    const packageJsonString = await fsExtra.readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonString);

    if (!packageJson || typeof packageJson !== 'object') {
      throw new Error('Nội dung của package.json không hợp lệ.');
    }

    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;

    return { depCount, devDepCount };
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error.message);
    return { depCount: -1, devDepCount: -1 };
  }
}




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

async function onCall({ message, Threads, userID, userName }) {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const uptime = process.uptime();
    const { depCount, devDepCount } = await getDependencyCount();
    const primaryIp = getPrimaryIP();
    const botStatus = getStatusByPing(Date.now() - message.timestamp);
  const uptimeHours = Math.floor(uptime / (60 * 60));
  const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  const uptimeString = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;

	  const userInfoe = await global.api.getUserInfo([message.senderID]);
      const userNamee = userInfoe[message.senderID].name;
   const replyMsg = `
『 𝚄𝙿𝚃𝙸𝙼𝙴 𝚁𝙾𝙱𝙾𝚃 』
▱▱▱▱▱▱▱▱▱▱▱▱▱
|‣ Time online: ${uptimeString}
————————————————
|‣ Tổng số package sống: ${depCount}
|‣ Tống số package chết: ${devDepCount}
————————————————
|‣ Tình trạng: ${botStatus}
————————————————
|‣ Ping: ${Date.now() - message.timestamp}ms
————————————————
|‣ RAM: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB
|‣ CPU: ${os.cpus().length} core(s) - ${os.cpus()[0].model.trim()} @ ${os.cpus()[0].speed}MHz
|‣ Hệ điều hành: ${os.type()} ${os.release()} (${os.arch()})
————————————————
• Yêu cầu bởi: ${userNamee}
▱▱▱▱▱▱▱▱▱▱▱▱▱
• ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}`.trim();
    api.sendMessage(replyMsg, message.threadID, message.messageID);

}
		export default {
  config,
  onCall
};
