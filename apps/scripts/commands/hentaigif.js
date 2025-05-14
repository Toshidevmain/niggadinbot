const axios = require("axios");

const meta = {
  name: "hentaigif",
  version: "1.0.0",
  author: "TOSHI",
  aliases: ["hg"],
  prefix: "both",
  description: "Fetches a random Hentai GIF.",
  guide: ["hentaigif"],
  cooldown: 0,
  type: "vip",
  category: "nsfw",
};

async function onStart({ bot, msg, chatId, log }) {
  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Fetching a Hentai GIF...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const apiUrl = `${global.api.kaiz}/api/hentaigif`;
    const response = await axios.get(apiUrl);
    const gifUrls = response.data.gifs;
    const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];

    await bot.deleteMessage(chatId, waitMId);

    await bot.sendAnimation(chatId, randomGif, {
      caption: "Enjoy this Hentai GIF! 😉",
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `hentaigif:${messageId}`
            }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("Error in hentaigif command:", error.message);
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
}

async function onCallback({ bot, callbackQuery, payload, log }) {
  try {
    if (!callbackQuery.data.startsWith("hentaigif:")) return;

    const messageId = callbackQuery.message.message_id;
    await bot.deleteMessage(callbackQuery.message.chat.id, messageId);

    const apiUrl = `${global.api.kaiz}/api/hentaigif`;
    const response = await axios.get(apiUrl);
    const gifUrls = response.data.gifs;
    const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];

    await bot.sendAnimation(callbackQuery.message.chat.id, randomGif, {
      caption: "Enjoy this Hentai GIF again! 😉",
      reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `hentaigif:${messageId}`
            }
          ]
        ]
      }
    });

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error("Error in hentaigif callback:", err.message);
    try {
      await bot.answerCallbackQuery(callbackQuery.id, { text: "An error occurred. Please try again." });
    } catch (innerErr) {
      console.error("Failed to answer callback query:", innerErr.message);
    }
  }
}

module.exports = {
  meta,
  onStart,
  onCallback
};