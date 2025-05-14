const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "downloader",
  keyword: [
    "https://vt.tiktok.com",
    "https://www.tiktok.com/",
    "https://www.facebook.com",
    "https://www.instagram.com/",
    "https://youtu.be/",
    "https://youtube.com/",
    "https://x.com/",
    "https://twitter.com/",
    "https://vm.tiktok.com",
    "https://fb.watch",
    "https://pin.it",
    "https://www.capcut.com",
    "https://reddit.com",
    "https://snapchat.com"
  ],
  aliases: [],
  version: "1.0.0",
  author: "TOSHI",
  description: "Auto downloads videos from social media platforms.",
  guide: ["[video_link]"],
  cooldown: 0,
  type: "anyone",
  category: "media",
};

async function onStart({ bot, msg, chatId }) {
  await bot.sendMessage(chatId, 
  `Send a video link, and I'll download it for you!\n\n<b>Supported platforms:</b>\n
- TikTok
- Facebook
- Instagram
- YouTube
- X (Twitter)
- Pinterest
- CapCut
- Reddit
- Snapchat`,
  { parse_mode: "HTML" }
);
}

async function onWord({ bot, msg, chatId }) {
  const messageText = msg.link_preview_options?.url || msg.text || "";
  const input = messageText;

  const supported = this.meta.keyword.some(url => input.startsWith(url));
  if (!supported) return;

  try {
    const messageId = msg.message_id;
    const wait = await bot.sendMessage(chatId, "⏳ Processing your request...", {
      reply_to_message_id: messageId,
    });

    const waitMId = wait.message_id;
    const videoPath = path.join(__dirname, "..", "..", "temp", "downloaded_video.mp4");
    let apiUrl = "", downloadLink = "";

    if (input.includes('x.com') || input.includes('twitter.com')) {
      apiUrl = `${global.api.kaiz}/api/twitter-xdl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.downloadLinks[0].link;
    } else if (input.includes('pin.it')) {
      apiUrl = `${global.api.kaiz}/api/pinte-dl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.video.url;
    } else if (input.includes('capcut.com')) {
      apiUrl = `${global.api.kaiz}/api/capcutdl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.url;
    } else if (input.includes('youtube.com') || input.includes('youtu.be')) {
      apiUrl = `${global.api.kaiz}/api/ytdl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.download_url;
    } else if (input.includes('reddit.com')) {
      apiUrl = `${global.api.kaiz}/api/reddit-dl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.mp4.find(video => video.quality === "350p")?.url || response.data.mp4[0].url;
    } else if (input.includes('snapchat.com')) {
      apiUrl = `${global.api.kaiz}/api/snapchat-dl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.url;
    } else if (input.includes('facebook.com') || input.includes('fb.watch')) {
      apiUrl = `${global.api.kaiz}/api/fbdl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.videoUrl;
    } else if (input.includes('tiktok.com') || input.includes('vt.tiktok.com') || input.includes('vm.tiktok.com')) {
      apiUrl = `${global.api.kaiz}/api/tiktok-dl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.url;
    } else if (input.includes('instagram.com')) {
      apiUrl = `${global.api.kaiz}/api/insta-dl?url=${encodeURIComponent(input)}`;
      const response = await axios.get(apiUrl);
      downloadLink = response.data.result.video_url;
    }

    const videoBuffer = (await axios.get(downloadLink, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(videoPath, Buffer.from(videoBuffer, "utf-8"));

    await bot.deleteMessage(chatId, waitMId);

    await bot.sendVideo(chatId, videoPath, {
      caption: "Download Sucess ✅",
      reply_to_message_id: messageId,
    }, {
      filename: "video.mp4",
      contentType: "video/mp4",
    });

    fs.unlinkSync(videoPath);
  } catch (error) {
    await bot.sendMessage(chatId, `❎ Error: ${error.message}`);
  }
};

module.exports = {
  meta,
  onStart,
  onWord,
};