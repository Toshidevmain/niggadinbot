const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "blowjob",
  version: "1.0.0",
  author: "TOSHI",
  aliases: ["bj"],
  prefix: "both",
  description: "Fetches a random Blowjob GIF.",
  guide: ["blowjob"],
  cooldown: 0,
  type: "vip",
  category: "nsfw",
};

async function onStart({ bot, msg, chatId, log }) {
  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Fetching a Blowjob GIF...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const apiUrl = `${global.api.kaiz}/api/blowjob`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const filePath = path.join(__dirname, `blowjob_${Date.now()}.gif`);
    fs.writeFileSync(filePath, response.data);

    await bot.deleteMessage(chatId, waitMId);

    const sentMessage = await bot.sendDocument(chatId, fs.createReadStream(filePath), {
      caption: "Oopsie! 👀",
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `blowjob:${messageId}`
            }
          ]
        ]
      }
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete GIF file:", err.message);
    });
  } catch (error) {
    console.error("Error in blowjob command:", error.message);
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
}

async function onCallback({ bot, callbackQuery, payload, log }) {
  try {
    if (!callbackQuery.data.startsWith("blowjob:")) return;

    const messageId = callbackQuery.message.message_id;
    await bot.deleteMessage(callbackQuery.message.chat.id, messageId);

    const apiUrl = `${global.api.kaiz}/api/blowjob`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const filePath = path.join(__dirname, `blowjob_${Date.now()}.gif`);
    fs.writeFileSync(filePath, response.data);

    const sentMessage = await bot.sendDocument(callbackQuery.message.chat.id, fs.createReadStream(filePath), {
      caption: "Oopsie! 😉",
      reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁",
              callback_data: `blowjob:${messageId}`
            }
          ]
        ]
      }
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete GIF file:", err.message);
    });

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error("Error in blowjob callback:", err.message);
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