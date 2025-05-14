const axios = require("axios");

const meta = {
  name: "neko",
  version: "1.0.0",
  author: "TOSHI",
  prefix: "both",
  description: "Fetches a random Neko image.",
  guide: ["neko"],
  cooldown: 0,
  type: "anyone",
  category: "anime",
};

async function onStart({ bot, msg, chatId, log }) {
  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Fetching a cute neko...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const apiUrl = `${global.api.kaiz}/api/neko`;
    const response = await axios.get(apiUrl);

    const imageUrl = response.data.imageUrl;

    await bot.deleteMessage(chatId, waitMId);

    const inlineKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "neko",
            gameMessageId: null,
            args: ["refresh"]
          }),
        },
      ],
    ];

    const sentMessage = await bot.sendPhoto(chatId, imageUrl, {
      caption: "Here's a random neko for you!",
      reply_to_message_id: messageId,
      reply_markup: { inline_keyboard: inlineKeyboard },
    });

    const updatedKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "neko",
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
  } catch (error) {
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
}

async function onCallback({ bot, callbackQuery, payload, log }) {
  try {
    if (payload.command !== "neko") return;
    if (!payload.gameMessageId || callbackQuery.message.message_id !== payload.gameMessageId) return;

    const apiUrl = `${global.api.kaiz}/api/neko`;
    const response = await axios.get(apiUrl);
    const imageUrl = response.data.imageUrl;

    const updatedKeyboard = [
      [
        {
          text: "🔁",
          callback_data: JSON.stringify({
            command: "neko",
            gameMessageId: payload.gameMessageId,
            args: ["refresh"]
          }),
        },
      ],
    ];

    await bot.editMessageMedia(
      {
        type: "photo",
        media: imageUrl,
        caption: "Here's another neko!",
      },
      {
        chat_id: callbackQuery.message.chat.id,
        message_id: payload.gameMessageId,
        reply_markup: { inline_keyboard: updatedKeyboard }
      }
    );

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    log.error("Error in neko callback: " + err.message);
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