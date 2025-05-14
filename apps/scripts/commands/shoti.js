const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "shoti",
  version: "1.0.0",
  author: "TOSHI",
  aliases: ["st"],
  prefix: "both",
  description: "Fetches a random Shoti video.",
  guide: ["shoti"],
  cooldown: 0,
  type: "anyone",
  category: "media",
};

async function onStart({ bot, msg, chatId, log }) {
  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Fetching random Shoti video...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const videoPath = path.join(__dirname, "..", "..", "temp", "shoti_video.mp4");
    const apiUrl = `${global.api.shoti}/shotizxx?apikey=shipazu`;
    const response = await axios.get(apiUrl);

    const videoUrl = response.data.shotiurl;
    const username = response.data.username;
    const nickname = response.data.nickname;
    const region = response.data.region;
    const infoMessage = `𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${username}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${nickname}\n𝗥𝗲𝗴𝗶𝗼𝗻: ${region}`;

    const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(videoPath, Buffer.from(videoBuffer, "utf-8"));

    await bot.deleteMessage(chatId, waitMId);

    const inlineKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "shoti",
            gameMessageId: null,
            args: ["refresh"]
          }),
        },
      ],
    ];

    const sentMessage = await bot.sendVideo(chatId, videoPath, {
      caption: infoMessage,
      reply_to_message_id: messageId,
      reply_markup: { inline_keyboard: inlineKeyboard },
    }, {
      filename: "shoti.mp4",
      contentType: "video/mp4",
    });

    const updatedKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "shoti",
            gameMessageId: sentMessage.message_id,
            args: ["refresh"]
          }),
        },
      ],
    ];

    await bot.editMessageReplyMarkup(
      { inline_keyboard: updatedKeyboard },
      { chat_id: chatId, message_id: sentMessage.message_id }
    );

    fs.unlinkSync(videoPath);
  } catch (error) {
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
}

async function onCallback({ bot, callbackQuery, payload, log }) {
  try {
    if (payload.command !== "shoti") return;
    if (!payload.gameMessageId || callbackQuery.message.message_id !== payload.gameMessageId) return;

    const apiUrl = `${global.api.shoti}/shotizxx?apikey=shipazu`;
    const response = await axios.get(apiUrl);
    const videoUrl = response.data.shotiurl;
    const username = response.data.username;
    const nickname = response.data.nickname;
    const region = response.data.region;
    const infoMessage = `𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${username}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${nickname}\n𝗥𝗲𝗴𝗶𝗼𝗻: ${region}`;

    const updatedKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "shoti",
            gameMessageId: payload.gameMessageId,
            args: ["refresh"]
          }),
        },
      ],
    ];

    await bot.editMessageMedia(
      {
        type: "video",
        media: videoUrl,
        caption: infoMessage,
      },
      {
        chat_id: callbackQuery.message.chat.id,
        message_id: payload.gameMessageId,
        reply_markup: { inline_keyboard: updatedKeyboard }
      }
    );

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    log.error("Error in shoti callback: " + err.message);
    try {
      await bot.answerCallbackQuery(callbackQuery.id, { text: "An error occurred. Please try again." });
    } catch (innerErr) {
      log.error("Failed to answer callback query: " + innerErr.message);
    }
  }
}

module.exports = {
  meta,
  onStart,
  onCallback
};