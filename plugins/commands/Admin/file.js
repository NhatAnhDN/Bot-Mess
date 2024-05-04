const config = {
  name: "file",
  aliases: ["delfile"],
  description: "xem item trong folder, xóa, xem file",
  usage: "<>",
  credits: "BraSL - nguyen blue fix"
};

import { readdirSync, statSync, unlinkSync, rmdirSync, readFileSync, createReadStream } from 'fs';
import { join } from 'path';

const PATH = join(global.pluginsPath);

async function replyFile({ message, eventData }) {
  const { threadID, senderID, args, reply } = message;
  const { data, author } = eventData;
  var count = 0;

  try {
    if (author != senderID) return;

    switch (message.args[0].toLowerCase()) {
      case 'open':
        openFolder(message, message, data[message.args[1] - 1].dest);
        break;
      case 'del':
        {
          var arrFile = [],
            fo,
            fi;
          for (const i of message.args.splice(1)) {
            const {
              dest,
              info
            } = data[i - 1];
            const ext = dest.split('/').pop();
            if (info.isFile()) unlinkSync(dest),
              arrFile.push(ext),
              fi = 'file'; else if (info.isDirectory()) rmdirSync(dest, {
                recursive: true
              }),
              arrFile.push(ext),
              fo = 'folder';
          };
          reply(`Đã xóa những ${!!fo && !!fi ? `${fo}, ${fi}` : !!fo ? fo : !!fi ? fi : null}:\n\n${arrFile.join(', ')}`);
        };
        break;
      case 'view':
        {
          const fileContent = readFileSync(data[message.args[1] - 1].dest, 'utf8');
          reply(fileContent);
        }
        break;
      default:
        reply(`Reply [Open|del|view] + STT.`);
    };
  } catch (e) {
    console.error(e || "WTFFF");
    message.reply(getLang("error"));
  }
}

function convertBytes(size) {
  const KB = size / 1024;
  const MB = KB / 1024;
  const GB = MB / 1024;

  if (GB >= 1) {
    return GB.toFixed(2) + 'GB';
  } else if (MB >= 1) {
    return MB.toFixed(2) + 'MB';
  } else {
    return KB.toFixed(2) + 'KB';
  }
}

function openFolder(a, b, c) {
  const read = readdirSync(c);

  var txt = '',
    count = 0;
  var array = [];
  for (const i of read) {
    const dest = `${c}/${i}`,
      info = statSync(dest);
    txt += `${++count}. ${info.isFile() ? '📄' : info.isDirectory() ? '📁' : undefined} - ${i} (${convertBytes(info.size)})\n`;
    array.push({
      dest, info
    });
  };

  txt += `\n--> Reply [Open|Del|View] + STT.`
  return a.reply(txt).then(ab => ab.addReplyEvent({ data: array, author: a.senderID, callback: replyFile }));
};

// Replace the adminUID with the actual admin UID you want to check against
const adminUID = "1290157550";

export async function onCall({ message, args, data }) {
  if (message.senderID !== adminUID) {
    api.sendMessage(`tuổi cặc đòi dùng`, message.threadID, message.messageID);
    return;
  }
  openFolder(message, message, PATH)
}

export default {
  config,
  onCall
}
