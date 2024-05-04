const config = {
  name: "help",
  _name: {
    "ar_SY": "الاوامر"
  },
  aliases: ["cmds", "commands", "menu", "cmd"],
  version: "1.0.3",
  description: "Hiển thị tất cả các lệnh hoặc chi tiết lệnh",
  usage: "[lệnh] (tùy chọn)",
  permissions: [0],
  credits: "XaviaTeam"
}

const langData = {
  "vi_VN": {
    "help.list": `
╔════════════════════════════════╗
{list}
╚════════════════════════════════╝
╭────╮
 🚀 Số lệnh có thể sử dụng: {total} / Tổng số lệnh gốc: xxx
╰────╯
➜ Yêu cầu bởi: {userNamee} - {threadName}
➜ Vui lòng không spam 
➜ Gỡ tự động sau: 60s`,
    "help.commandNotExists": "Lệnh {command} không tồn tại.",
    "help.commandDetails": `
⇒ Tên: {name}
⇒ Tên khác: {aliases}
⇒ Phiên bản: {version}
⇒ Mô tả: {description}
⇒ Cách sử dụng: {usage}
⇒ Quyền hạn: {permissions}
⇒ Thể loại: {category}
⇒ Thời gian chờ: {cooldown}
⇒ Người viết: {credits}\n➜ Gỡ tự động sau: 60s
        `,
    "0": "Thành viên",
    "1": "Quản trị nhóm",
    "2": "Quản trị bot"
  }
}

function getCommandName(commandName, commandsConfig) {
  if (global.plugins.commandsAliases.has(commandName)) return commandName;

  for (let [key, value] of global.plugins.commandsAliases) {
    if (value.includes(commandName)) return key;
  }

  return null
}

async function onCall({ message, args, getLang, userPermissions, prefix }) {
  const { commandsConfig } = global.plugins;
  const commandName = args[0]?.toLowerCase();
  const userInfoe = await global.api.getUserInfo([message.senderID]);
  const userNamee = userInfoe[message.senderID].name;
  const threadInfo = await api.getThreadInfo(message.threadID);
  const threadName = threadInfo.threadName || "Đoạn Chat Riêng !";

  if (!commandName) {
    let commands = {};
    const language = data?.thread?.data?.language || global.config.LANGUAGE || 'en_US';
    let rootCommandsCount = 0;
    for (const [key, value] of commandsConfig.entries()) {
      if (!!value.isHidden) continue;
      if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
      if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
      if (!value.permissions.some(p => userPermissions.includes(p))) continue;
      if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
      commands[value.category].push({
        name: key,
        description: value._name && value._name[language] ? value._name[language] : value.description || '',
      });
      rootCommandsCount++;
    }

    let list = Object.keys(commands)
      .map(category => `\n『  ${category.toUpperCase()}  』\n ${commands[category].map(command => `➩ ${command.name} || ${command.description}`).join("\n")}`);

    const replyMessage = await message.reply(getLang("help.list", {
      total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
      list,
      syntax: message.args[0].toLowerCase(),
      userNamee,
      threadName
    }));

    setTimeout(() => {
      api.unsendMessage(replyMessage.messageID, err => {
        if (err) {
          const errorMessage = api.sendMessage(getText('error'), message.threadID, message.messageID);
          setTimeout(() => {
            api.unsendMessage(errorMessage.messageID);
          }, 60000);
        }
      });
    }, 60000);
  } else {
    const command = commandsConfig.get(getCommandName(commandName, commandsConfig));
    if (!command) return message.reply(getLang("help.commandNotExists", { command: commandName }));

    const isHidden = !!command.isHidden;
    const isUserValid = !!command.isAbsolute ? global.config?.ABSOLUTES.some(e => e == message.senderID) : true;
    const isPermissionValid = command.permissions.some(p => userPermissions.includes(p));
    if (isHidden || !isUserValid || !isPermissionValid)
      return message.reply(getLang("help.commandNotExists", { command: commandName }));

    const replyMessage = await message.reply(getLang("help.commandDetails", {
      name: command.name,
      aliases: command.aliases.join(", "),
      version: command.version || "1.0.0",
      description: command.description || '',
      usage: `${prefix}${commandName} ${command.usage || ''}`,
      permissions: command.permissions.map(p => getLang(String(p))).join(", "),
      category: command.category,
      cooldown: command.cooldown || 3,
      credits: command.credits || ""
    }));

    setTimeout(() => {
      api.unsendMessage(replyMessage.messageID, err => {
        if (err) {
          const errorMessage = api.sendMessage(getText('error'), message.threadID, message.messageID);
          setTimeout(() => {
            api.unsendMessage(errorMessage.messageID);
          }, 60000);
        }
      });
    }, 60000);
  }
}

export default { config, langData, onCall };

