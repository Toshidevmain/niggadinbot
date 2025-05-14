const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "upscale",
  version: "1.0.0",
  author: "TOSHI",
  prefix: "both",
  description: "Upscales a replied image using the Kaiz API.",
  guide: ["(reply to an image) upscale"],
  cooldown: 0,
  type: "anyone",
  category: "media",
};

async function onStart({ bot, msg, chatId }) {
  const messageId = msg.message_id;

  try {
    const reply = msg.reply_to_message;
    if (!reply || !reply.photo) {
      return await bot.sendMessage(chatId, "❎ Please reply to an image to upscale it.", {
        reply_to_message_id: messageId,
      });
    }

    const photo = reply.photo[reply.photo.length - 1];
    const file = await bot.getFile(photo.file_id);
    const botToken = global.states.tokens[0];
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

    const wait = await bot.sendMessage(chatId, "⏳ Upscaling image...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const apiUrl = `${global.api.kaiz}/api/upscale?imageUrl=${encodeURIComponent(fileUrl)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const imagePath = path.join(__dirname, "..", "..", "temp", "upscaled_image.jpg");
    fs.writeFileSync(imagePath, Buffer.from(response.data));

    await bot.deleteMessage(chatId, waitMId);

    await bot.sendPhoto(chatId, imagePath, {
      caption: "✅ Image upscaled successfully.",
      reply_to_message_id: messageId,
    });

    fs.unlinkSync(imagePath);

  } catch (error) {
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`, {
      reply_to_message_id: messageId,
    });
  }
}

module.exports = { meta, onStart };