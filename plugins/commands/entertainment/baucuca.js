import fs from "fs";
import { join } from "path";

const config = {
  name: "baucua",
  description: "Chơi trò chơi Bầu Cua Cá",
  credits: "Sleiz",
  cooldown: 3,
  permissions: [0],
};

const dataFilePath = join(global.assetsPath, 'baucua_data.json');

function onLoad() {
  if (!global.baucuGames) {
    global.baucuGames = new Map();
  }

  if (!global.scores) {
    global.scores = new Map();
  }
}

async function getUserName(userID) {
  return new Promise((resolve, reject) => {
    global.api.getUserInfo(userID, (err, info) => {
      if (err) return reject(err);
      const userName = info[userID]?.name || `@${userID}`;
      resolve(userName);
    });
  });
}

async function getLeaderboard() {
  const { Users } = global.controllers;
  const sortedScores = [...global.scores.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedScores.length === 0) {
    return "Chưa Có Ai Lọt Top Rank Bầu Cua Cá";
  }

  const topPlayers = sortedScores.slice(0, 5);
  let leaderboard = "===== Top Players =====\n";

  for (let i = 0; i < topPlayers.length; i++) {
    const [userId, score] = topPlayers[i];
    const userName = await getUserName(userId);
    leaderboard += `${i + 1}. ${userName}: ${score} points\n`;
  }

  leaderboard += "\n===== Top Money =====\n";
  const sortedMoney = [...global.scores.entries()].sort((a, b) => b[1] - a[1]);
  const topMoneyPlayers = sortedMoney.slice(0, 5);

  for (let i = 0; i < topMoneyPlayers.length; i++) {
    const [userId] = topMoneyPlayers[i];
    const userName = await getUserName(userId);
    const userMoney = await Users.getMoney(userId);
    leaderboard += `${i + 1}. ${userName}: ${userMoney}$\n`;
  }

  // Save data to JSON file
  const leaderboardData = {
    topPlayers: topPlayers.map(([userId, score]) => ({ userId, score })),
    topMoneyPlayers: topMoneyPlayers.map(([userId]) => ({ userId })),
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(leaderboardData, null, 2), 'utf8');

  return leaderboard;
}

async function updateScore(userId, points) {
  global.scores.set(userId, (global.scores.get(userId) || 0) + points);
}

async function onCall({ message, args }) {
  const { threadID, senderID } = message;
  const { Users } = global.controllers;

  let input = args[0];

switch (input) {
  case "create": {
    let baucuGame = global.baucuGames.get(threadID);
    if (baucuGame) return message.send(`Nhóm đã có một trò chơi Bầu Cua Cá được tạo bởi ${baucuGame.author}!`);

    global.baucuGames.set(threadID, { author: senderID, status: "pending", players: [], settings: { betLimit: 100, rounds: 5 } });

    message.send("Trò chơi Bầu Cua Cá đã được tạo thành công!\nSố người chơi hiện tại: 1");
    break;
  }

  case "join": {
    let baucuGame = global.baucuGames.get(threadID);

    if (!baucuGame) return message.send("Nhóm không có trò chơi Bầu Cua Cá nào đang hoạt động!");
    if (baucuGame.status === "starting") return message.send("Bạn không thể tham gia vì trò chơi Bầu Cua Cá trong nhóm này đã bắt đầu!");

    if (baucuGame.players.some(e => e.id === senderID)) {
      message.send("Bạn đã ở trong trò chơi Bầu Cua Cá này rồi!");
    } else {
      if (isNaN(args[1])) return message.send("Số tiền đặt cược không hợp lệ!");
      const userMoney = await Users.getMoney(senderID);
      if (parseInt(args[1]) > userMoney) return message.send(`Bạn không có đủ tiền để đặt cược. Bạn chỉ có ${userMoney}$`);
      if (!args[2] || !["bầu", "cua", "tôm", "cá", "gà", "nai"].includes(args[2].toLowerCase())) return message.send("Bạn phải chọn bầu, cua, tôm, cá, gà, hoặc nai!");

      let bet = parseInt(args[1]);
      let choice = args[2].toLowerCase();

      baucuGame.players.push({ id: senderID, bet, choice });
      message.send(`Bạn đã tham gia trò chơi với một mức cược là ${bet}$ trên lựa chọn ${choice}`);
    }
    break;
  }

    case "start": {
      let baucuGame = global.baucuGames.get(threadID);
      if (!baucuGame) return message.send("Nhóm không có trò chơi Bầu Cua Cá nào đang hoạt động!");

      baucuGame.status = "starting";
      await message.send('Đang Quay Xúc Sắc..');
      const options = ["bầu", "cua", "tôm", "cá", "gà", "nai"];
      const result = options[Math.floor(Math.random() * options.length)];
      const result1 = options[Math.floor(Math.random() * options.length)];
      const result2 = options[Math.floor(Math.random() * options.length)];

      const imageUrls = {
        "bầu": "https://i.imgur.com/1MZ2RUz.jpg",
        "tôm": "https://i.imgur.com/8nTJyNK.jpg",
        "cua": "https://i.imgur.com/OrzfTwg.jpg",
        "cá": "https://i.imgur.com/EOH26Am.jpg",
        "gà": "https://i.imgur.com/uV4eyKs.jpg",
        "nai": "https://i.imgur.com/sPP6Glh.jpg",
      };

      const resultImageStream = await global.getStream(imageUrls[result]);
      const resultImageStream1 = await global.getStream(imageUrls[result1]);
      const resultImageStream2 = await global.getStream(imageUrls[result2]);

      let playersWon = [];
      let playersLost = [];
      let resultMessage = `Kết quả là: ${result} | ${result1} | ${result2}\n`;

      for (let player of baucuGame.players) {
        const userName = await getUserName(player.id);

        const matchingResults = [result, result1, result2].filter(r => player.choice === r);

        if (matchingResults.length === 2 || matchingResults.length === 3) {
          playersWon.push({ id: player.id, bet: player.bet * matchingResults.length, username: userName });
          await Users.increaseMoney(player.id, player.bet * matchingResults.length);
          await updateScore(player.id, player.bet * matchingResults.length); // Update global score
          resultMessage += `${userName} chiến thắng với ${player.choice} và nhận được ${player.bet * matchingResults.length}$!\n`;
        } else {
          playersLost.push({ id: player.id, bet: player.bet, username: userName });
          await Users.decreaseMoney(player.id, player.bet);
          await updateScore(player.id, -player.bet);
          resultMessage += `${userName} thua với lựa chọn ${player.choice} và mất ${player.bet}$\n`;
        }
      }

      global.baucuGames.delete(threadID);

      await message.send({
        body: resultMessage,
        attachment: [resultImageStream, resultImageStream1, resultImageStream2]
      });

      break;
    }

  case "status": {
    let baucuGame = global.baucuGames.get(threadID);
    if (!baucuGame) {
      message.send("Không có trò chơi Bầu Cua Cá nào đang hoạt động trong nhóm này.");
    } else {
      let statusMessage = `Trạng thái trò chơi Bầu Cua Cá hiện tại: ${baucuGame.status}\n`;

      if (baucuGame.status === "starting") {
        statusMessage += `Số người chơi: ${baucuGame.players.length}\n`;
        statusMessage += `Cược tối đa: ${baucuGame.settings.betLimit}$\n`;
        statusMessage += `Số vòng chơi: ${baucuGame.settings.rounds}\n`;
        statusMessage += `Người tạo: ${await getUserName(baucuGame.author)}\n`;
        statusMessage += "Danh sách người chơi:\n";

        baucuGame.players.forEach(async (player) => {
          const userName = await getUserName(player.id);
          statusMessage += `${userName}: ${player.bet}$, Chọn: ${player.choice}\n`;
        });
      }

      message.send(statusMessage);
    }
    break;
  }

  case "balance": {
    const userMoney = await Users.getMoney(senderID);
    message.send(`Số dư hiện tại của bạn là: ${userMoney}$`);
    break;
  }

  case "end": {
    let baucuGame = global.baucuGames.get(threadID);
    if (!baucuGame) return message.send("Không có trò chơi Bầu Cua Cá nào đang hoạt động trong nhóm này.");
    if (baucuGame.author !== senderID) return message.send("Bạn không phải là chủ nhóm của trò chơi Bầu Cua Cá!");

    for (let player of baucuGame.players) {
      await Users.increaseMoney(player.id, player.bet);
    }

    global.baucuGames.delete(threadID);
    message.send("Trò chơi Bầu Cua Cá đã kết thúc.");
    break;
  }

  case "top": {
      const leaderboard = await getLeaderboard();
      message.send(`===== Leaderboard =====\n- Top Những Người Chơi Có Số Điểm Cao Nhất\n${leaderboard}`);
      break;
    }

    default: {
      message.send(`================= [ Bầu Cua Cá ] =================\n\n- baucu create: Tạo một trò chơi Bầu Cua Cá\n- baucu join <số tiền>: Tham gia trò chơi Bầu Cua Cá\n- baucu start: Bắt đầu trò chơi Bầu Cua Cá\n- baucu status: Xem trạng thái trò chơi Bầu Cua Cá\n- baucu balance: Xem số dư hiện tại của bạn\n- baucu end: Kết thúc trò chơi Bầu Cua Cá\n- baucu top: Xem bảng xếp hạng\n\n================= [ SLEIZ ] =================`);
    }
  }
}

export {
  config,
  onCall,
  onLoad
};