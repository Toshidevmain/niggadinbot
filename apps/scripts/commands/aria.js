const axios = require('axios');

const meta = {
  name: "aria",
  version: "1.0.0",
  aliases: [],
  description: "Ask Aria AI anything",
  author: "TOSHI",
  prefix: "both",
  category: "ai",
  type: "anyone",
  cooldown: 5,
  guide: "[your question]"
};

async function onStart({ bot, args, message, msg, usages }) {
  try {
    const chatId = msg.chat.id;
    const question = args.join(" ");
    if (!question) return usages();

    const response = await axios.get(`${global.api.kaiz}/api/aria?ask=${encodeURIComponent(question)}&uid=${chatId}`);

    if (response.data && response.data.response) {
      return message.reply(`● 𝗔𝗿𝗶𝗮 𝗔𝗜\n\n${response.data.response}`);
    } else {
      return message.reply("Aria AI couldn't generate a response. Please try again later.");
    }
  } catch (error) {
    console.error(`[ ${meta.name} ] » ${error}`);
    return message.reply(`[ ${meta.name} ] » An error occurred while connecting to Aria AI.`);
  }
}

module.exports = { meta, onStart };