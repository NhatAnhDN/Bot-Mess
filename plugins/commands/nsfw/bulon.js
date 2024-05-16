export const config = {
    name: "bulon",
    version: "0.0.1-xaviabot-port-refactor",
    description: "bulon someone you tag",
    usage: "[tag]",
    cooldown: 5
};
//nguyen blue
export async function onCall({ message }) {
    if (!Object.keys(message.mentions).length) return message.reply("Vui lòng tag một người");

    const links = [
       "https://i.postimg.cc/KjLJwR7q/1.gif",
"https://i.postimg.cc/PJkmLKZy/13599182.gif",
"https://i.postimg.cc/y8nnMq9H/54674ada39121def8036f8183aa47c7c.gif",
"https://i.postimg.cc/zfBp5dSR/91fea1737989a057137c3c07df8560cf.gif",
"https://i.postimg.cc/JnXN4Syt/detail.gif",
"https://i.postimg.cc/xdhGQ91W/detail-1.gif",
"https://i.postimg.cc/43mvjYs6/detail-2.gif",
"https://i.postimg.cc/zvnFp454/oVtB5Ze.gif",
"https://i.postimg.cc/DZ4g48Nv/tumblr-m742cbe-Lyr1rat3p6o1-500.gif",
"https://i.postimg.cc/gkWDrcHp/tumblr-mju1prx-Ox-T1rke3fuo1-400.gif",
"https://i.postimg.cc/FHFVgP6n/tumblr-mxten51-GCl1smtpyco1-500.gif",
"https://i.postimg.cc/htCbCLW4/tumblr-n66ny2-AOCN1tck5t9o1-500.gif",    ];

    const randomLink = links[Math.floor(Math.random() * links.length)];

    try {
        const mention = Object.keys(message.mentions)[0];
        const tag = message.mentions[mention].replace("@", "");

        message.reply({
            body: `${tag}, 𝗡𝘂̛𝗼̛́𝗰 𝗘𝗺 𝗧𝘂𝗼̂𝗻𝗴 𝗥𝗮 𝗡𝗵𝘂̛ 𝗦𝗼̂𝗻𝗴 𝗠𝗲𝗸𝗼𝗻𝗴 𝗭𝗮̣̂𝘆𝘆 😋`,
            mentions: [
                {
                    tag: tag,
                    id: mention
                }
            ],
            attachment: await global.getStream(randomLink)
        });
    } catch (error) {
        console.error(error);
        message.reply("Có lỗi xảy ra khi thực hiện hành động này.");
    }
}
