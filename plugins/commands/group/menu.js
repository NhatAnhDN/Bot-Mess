const config = {
    name: "menu",
    aliases: ["menu"],
    version: "1.0.0",
    description: "Hiển thị toàn bộ chức năng mà bot có",
    usage: "",
    credits: "XIE (nguyên blue viết thêm)"
}

async function onCall({ message, args, userPermissions, language, api }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = { count: 0, commands: [] };
            commands[value.category].count++;
            commands[value.category].commands.push(value._name && value._name[language] ? value._name[language] : key);
        }

        const totalCommands = Object.values(commands).reduce((total, category) => total + category.count, 0);

        let list = Object.keys(commands)
            .map((category, index) => `\n${index + 1}.  ${category.toUpperCase()} || có ${commands[category].count} lệnh `)
            .join("");

        message.reply(' ====== Menu ====== ' + list + `\n╭────╮\n${totalCommands} lệnh\n╰────╯\n➜Gõ help để biết thêm chi tiết\n➜ Gỡ tự động sau: 20s`).then((replyMessage) => {
            // Lưu giữ messageID để sử dụng trong việc xóa tin nhắn sau một khoảng thời gian
            const messageID = replyMessage.messageID;

            // Tạo một Promise để đảm bảo rằng tin nhắn đã được gửi trước khi thực hiện xóa
            const sendPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 20000); // Thời gian chờ có thể điều chỉnh
            });

            // Sau khi tin nhắn đã được gửi, thực hiện hành động xóa
            sendPromise.then(() => {
                // Sử dụng unsendMessage để xóa tin nhắn
                global.api.unsendMessage(messageID, (err) => {
                    if (err) {
                        // Xử lý lỗi nếu không thể xóa tin nhắn
                        const errorMessage = api.sendMessage('Có lỗi xảy ra khi xóa tin nhắn.', message.threadID, message.messageID);
                        setTimeout(() => {
                            global.api.unsendMessage(errorMessage.messageID);
                        }, 20000);
                    }
                });
            });
        });
    }
}

export default {
    config,
    onCall
}
