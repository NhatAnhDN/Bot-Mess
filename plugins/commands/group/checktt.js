import { statSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

const config = {
    name: "checktt",
    aliases: ["check"],
    version: "0.0.1-xaviabot-port-refactor",
    description: "",
    usage: "",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Nghia/DungUwU" //locmem by BraSL
}

const checkttPATH = join(global.assetsPath, "checktt_x213");
let isReady = false;

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function onLoad({ }) {
    try {
        ensureFolderExists(checkttPATH);
        if (!global.hasOwnProperty("checktt_cache"))
            global.checktt_cache = new Map();

        readdirSync(checkttPATH).forEach(file => {
            let fileData = readFileSync(join(checkttPATH, file));
            let parsedData = isJSON(fileData) ? JSON.parse(fileData) : {
                day: [],
                week: [],
                all: []
            };

            global.checktt_cache.set(file.replace(".json", ""), parsedData);
        })

        clearInterval(global.checktt_interval);

        global.checktt_interval = setInterval(async () => {
            for (const [key, value] of global.checktt_cache) {
                let threadDataPATH = join(checkttPATH, `${key}.json`);

                writeFileSync(threadDataPATH, JSON.stringify(value, 'utf8', 4));
            }
        }, 1000 * 60 * 5);

        isReady = true;
    } catch (error) {
        console.error(error);
    }
}
async function chooseChecktt({ message, data, eventData }) {
    const { threadID, senderID, args } = message;
    const { Threads, Users } = global.controllers;
    const { allData, author } = eventData;
    const { ABSOLUTES } = global.config;
    var info = (await Threads.get(threadID)).info
  var listqtv = []
  for (let i = 0; i < info.adminIDs.length; i++) {
       listqtv.push(info.adminIDs[i].id)
    }
    var count = 0;
    try {

        if (author != senderID) return message.reply('Bạn không phải là người dùng lệnh nên ko thể reply!')
      if (!listqtv.includes(author)) return message.reply('Bạn không phải là qtv nên ko thể kick')
      
        let chosenIndexes = args
        if (isNaN(parseInt(chosenIndexes))) return message.reply("Khong phai mot so");
        const num = parseInt(chosenIndexes);

        const dataThreads = allData.filter(e => e.n <= num);

        let isBotAdmin = data?.thread?.info?.adminIDs?.some(e => e.id == global.botID);
        if (!isBotAdmin) return message.reply('Bot không phải qtv!')
        const datat = message.participantIDs.filter(e => !allData.some(ee => ee.id == e)).map(e => ({ id: e }));
        message.reply(' Bắt đầu lọc...');
        for (const user of [...dataThreads, ...datat]) {

            let isQtv = data?.thread?.info?.adminIDs?.some(e => e.id == user.id);
            if (global.botID !== user.id && !isQtv && !ABSOLUTES.includes(user.id)) {
                await new Promise(next => {

                    setTimeout(() => {
                        global.api.removeUserFromGroup(user.id, threadID, (err) => {
                            if (err) console.error(err);
                            next();
                            count++
                        })
                    }, 300);
                })

            }
        }
        return message.reply('Đã xoá thành công ' + count + ' người!')

    } catch (e) {
        console.error(e || "WTFFF");
        message.reply(getLang("error"));
    }
}

async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {
    try {
        const { threadID, senderID, mentions, messageReply, participantIDs } = message;
        /**
         * 👥 Tên: Phạm Lê Xuân Trường
        ━━━━━━━━━━━━━━
        💂‍♂️ Chức Vụ: Admin Bot
        ━━━━━━━━━━━━━━
        💬 Tin Nhắn Trong Tuần: 98
        💬 Tin Nhắn Trong Ngày: 40
        📝 Tổng: 649 (Top 1)
         */

        let threadDATA = global.checktt_cache.get(threadID);
        if (!threadDATA) return message.reply("Không có dữ liệu về nhóm này!");

        threadDATA.day = threadDATA.day.filter(item => participantIDs.some(e => e == item.id));
        threadDATA.week = threadDATA.week.filter(item => participantIDs.some(e => e == item.id));
        threadDATA.all = threadDATA.all.filter(item => participantIDs.some(e => e == item.id));

        if (args[0] == "all") {
            let allData = threadDATA.all.sort((a, b) => b.n - a.n);

            participantIDs.forEach(id => {
                if (!allData.some(e => e.id == id)) {
                    allData.push({
                        id: id,
                        n: 0
                    });
                }
            });

            let msg = "📊 Thống Kê Tổng Hợp:\n";

            for (let i = 0; i < allData.length; i++) {
                let name = (await global.controllers.Users.getName(allData[i].id)) || "Người dùng Facebook";
                msg += `${i + 1}. ${name} - ${allData[i].n}\n`;
              
            }
            msg += '\n↠ Reply số tin nhắn cần lọc!'
            const a = await message.reply(msg)
             
          function EventNew (){
          a.addReplyEvent({ allData, author: senderID, callback: chooseChecktt })
       }
          setInterval(EventNew, 1000)

        } else if (args[0] == "week") {
            let allData = threadDATA.week.sort((a, b) => b.n - a.n);

            participantIDs.forEach(id => {
                if (!allData.some(e => e.id == id)) {
                    allData.push({
                        id: id,
                        n: 0
                    });
                }
            });

            let msg = "📊 Thống Kê Của Tuần:\n";

            for (let i = 0; i < allData.length; i++) {
                let name = (await global.controllers.Users.getName(allData[i].id)) || "Người dùng Facebook";
                msg += `${i + 1}. ${name} - ${allData[i].n}\n`;
            }

            return message.reply(msg);
        } else if (args[0] == "day") {
            let allData = threadDATA.day.sort((a, b) => b.n - a.n);

            participantIDs.forEach(id => {
                if (!allData.some(e => e.id == id)) {
                    allData.push({
                        id: id,
                        n: 0
                    });
                }
            });

            let msg = "📊 Thống Kê Của Ngày:\n";

            for (let i = 0; i < allData.length; i++) {
                let name = (await global.controllers.Users.getName(allData[i].id)) || "Người dùng Facebook";
                msg += `${i + 1}. ${name} - ${allData[i].n}\n`;
            }

            return message.reply(msg);
        } else {
            const targetID = Object.keys(mentions)[0] || messageReply?.senderID || senderID;

            let findDay = threadDATA.day.find(item => item.id == targetID);
            let findWeek = threadDATA.week.find(item => item.id == targetID);
            let findTotal = threadDATA.all.find(item => item.id == targetID);

            let name = (await global.controllers.Users.get(targetID)).info.name || "Người dùng Facebook";

            let totalRank = threadDATA.all.findIndex(item => item.id == targetID) + 1;

            let msg =
                `👥 Tên: ${name}\n` +
                `━━━━━━━━━━━━━━\n` +
                `💂‍♂️ Chức Vụ: ${getRole(targetID, data?.thread?.info || null)}\n` +
                `━━━━━━━━━━━━━━\n` +
                `💬 Tin Nhắn Trong Tuần: ${findWeek ? findWeek.n : 0}\n` +
                `💬 Tin Nhắn Trong Ngày: ${findDay ? findDay.n : 0}\n` +
                `📝 Tổng: ${findTotal ? findTotal.n : 0} (Top ${totalRank})\n`;

            return message.reply(msg);
        }
    } catch (error) {
        console.error(error);
    }
}

export default {
    config,
    onLoad,
    onCall
}

function getRole(targetID, data) {
    let role = "Thành Viên";

    if (data != null && data.adminIDs.some(e => e.id == targetID)) role = "Admin Nhóm";
    if (global.config.MODERATORS.some(e => e == targetID)) role = "Admin Bot";

    return role;
}

function ensureFolderExists(path) {
    let folderStat = getStat(path);

    if (folderStat === null || !folderStat.isDirectory()) {
        mkdirSync(path);
    }
}

function getStat(path) {
    try {
        let stat = statSync(path);

        return stat;
    } catch (error) {
        console.error(error);
        return null;
    }
}


