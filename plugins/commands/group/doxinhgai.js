const config = {
  name: "doxinhgai",
  aliases: [],
  description: "Roll a dice to get a random IQ score",
  usage: "iq",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "",
  extra: {}
};

const langData = {
  "en_US": {
    "rolled": "🤗 Tỉ lệ độ đẹp gái của bạn \n[👩] Khoảng {result}%! ????"
  }
};

async function onCall({ message, args, getLang }) {
  const minIQ = 1; // minimum possible IQ score
  const maxIQ = 100; // maximum possible IQ score
  const result = Math.floor(Math.random() * (maxIQ - minIQ + 1)) + minIQ; // generate a random IQ score between the min and max values

  message.reply(getLang("rolled", {result}));
}

export default {
  config,
  langData,
  onCall
};