const axios = require('axios');

const meta = {
  name: "lyrics",
  aliases: ["songlyrics", "ly"],
  prefix: "both",
  version: "1.0.0",
  author: "TOSHI",
  description: "Get song lyrics",
  guide: ["<song name>"],
  cooldown: 5,
  type: "anyone",
  category: "music"
};

async function onStart({ bot, chatId, msg, args, usages, message }) {
  if (args.length === 0) {
    return await usages();
  }

  const song = args.join(" ");
  const apiUrl = `${global.api.kaiz}/api/shazam-lyrics?title=${encodeURIComponent(song)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.lyrics) {
      const { title, lyrics, thumbnail } = data;

      const chunks = lyrics.match(/[\s\S]{1,4096}/g) || [lyrics];
      for (const chunk of chunks) {
        await message.reply(chunk);
      }

      await message.photo(thumbnail, {
        caption: `**${title}**`,
        parse_mode: "Markdown"
      });

    } else {
      await message.reply("Song not found or an error occurred.");
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    await message.reply("An error occurred while fetching the lyrics.");
  }
}

module.exports = { meta, onStart };