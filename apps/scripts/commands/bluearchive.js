const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "bluearchive",
  version: "1.0.0",
  author: "TOSHI",
  aliases: ["ba"],
  prefix: "both",
  description: "Fetches a random Blue Archive image.",
  guide: ["bluearchive"],
  cooldown: 0,
  type: "anyone",
  category: "anime",
};

async function onStart({ bot, msg, chatId, log }) {
  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Fetching a Blue Archive image...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const apiUrl = `${global.api.kaiz}/api/bluearchive`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const filePath = path.join(__dirname, `bluearchive_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, response.data);

    await bot.deleteMessage(chatId, waitMId);

    const sentMessage = await bot.sendPhoto(chatId, fs.createReadStream(filePath), {
      caption: "Here's a Blue Archive image!",
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `bluearchive:${messageId}`
            }
          ]
        ]
      }
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image file:", err.message);
    });
  } catch (error) {
    console.error("Error in bluearchive command:", error.message);
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
}

async function onCallback({ bot, callbackQuery, payload, log }) {
  try {
    if (!callbackQuery.data.startsWith("bluearchive:")) return;

    const messageId = callbackQuery.message.message_id;
    await bot.deleteMessage(callbackQuery.message.chat.id, messageId);

    const apiUrl = `${global.api.kaiz}/api/bluearchive`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const filePath = path.join(__dirname, `bluearchive_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, response.data);

    const sentMessage = await bot.sendPhoto(callbackQuery.message.chat.id, fs.createReadStream(filePath), {
      caption: "Here's another Blue Archive image!",
      reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `bluearchive:${messageId}`
            }
          ]
        ]
      }
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image file:", err.message);
    });

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error("Error in bluearchive callback:", err.message);
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