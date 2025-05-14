const axios = require('axios');

const meta = {
  name: "ai",
  version: "1.0.0",
  aliases: ["artificial intelligence"],
  description: "Ask the AI a question",
  author: "TOSHI",
  prefix: "both",
  category: "ai",
  type: "anyone",
  cooldown: 5,
  guide: "[your question]"
};

async function onStart({ bot, args, message, msg, usages }) {
  const question = args.join(" ");
  if (!question) return usages();

  const apiUrl = `https://toshapi-production.up.railway.app/api?name=gemini&message=${encodeURIComponent(question)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data?.message) {
      return message.reply(data.message);
    } else {
      console.log("⚠️ Unexpected API response:", data);
      return message.reply("❌ I couldn’t understand that. Try again later.");
    }
  } catch (error) {
    console.error(`[ ${meta.name} ] » API Error:`, error.message || error);
    return message.reply("⚠️ The AI server is currently unavailable. Please try again shortly.");
  }
}

module.exports = { meta, onStart };
