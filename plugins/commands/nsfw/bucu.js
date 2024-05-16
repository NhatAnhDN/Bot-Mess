export const config = {
    name: "bucu",
    version: "0.0.1-xaviabot-port-refactor",
    description: "bucu someone you tag",
    usage: "[tag]",
    cooldown: 5
};
// nguyen blue
export async function onCall({ message }) {
    if (!Object.keys(message.mentions).length) return message.reply("Vui lòng tag một người");

    const links = [
        "https://i.postimg.cc/4y4FLjSN/blowjob-madoka-higuchi-najar-001.gif",
        "https://i.postimg.cc/SQVP2NnX/by-buckethead-porn-gifs-sex-gif.gif",
        "https://i.postimg.cc/HsxhQDM6/cartoon-bj-001.gif",
        "https://i.postimg.cc/GmTg5FqY/detail.gif",
        "https://i.postimg.cc/W3T9zQj6/Nats-Cocksuckers-Gif.gif"
    ];

    const randomLink = links[Math.floor(Math.random() * links.length)];

    try {
        const mention = Object.keys(message.mentions)[0];
        const tag = message.mentions[mention].replace("@", "");

        message.reply({
            body: `${tag}, 𝗕𝘂́ 𝗰𝘂 𝗰𝗵𝗼 𝗮𝗻𝗵 𝗯𝗮̆́𝗻 𝗻𝗵𝗮𝗻𝗵 𝗻𝗮̀𝗼 😋`,
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
