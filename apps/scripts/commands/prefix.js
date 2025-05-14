const meta = {
  name: "prefix",
  keyword: ["prefix", "Prefix", "PREFIX"],
  aliases: [],
  version: "1.0.0",
  author: "TOSHI",
  prefix: "both",
  description: "Displays the current bot prefix and basic info.",
  guide: ["prefix"],
  cooldown: 0,
  type: "anyone",
  category: "system",
};

function generateInfoText(prefix, botName, botId, botLink) {
  return `<b>Bot Info</b>\n
<b>Current Prefix:</b> <code>${prefix}</code>
<b>Bot Name:</b> ${botName}
<b>Bot ID:</b> <code>${botId}</code>
<b>Bot Link:</b> ${botLink}`;
}

async function onStart({ bot, msg, chatId }) {
  const me = await bot.getMe();
  const text = generateInfoText(global.settings.prefix, me.first_name, me.id, `https://t.me/${me.username}`);
  await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
}

async function onWord({ bot, msg, chatId }) {
  const messageText = msg.text?.trim() || "";
  const matched = this.meta.keyword.includes(messageText);
  if (!matched) return;

  const me = await bot.getMe();
  const text = generateInfoText(global.settings.prefix, me.first_name, me.id, `https://t.me/${me.username}`);
  await bot.sendMessage(chatId, text, {
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id,
  });
}

module.exports = {
  meta,
  onStart,
  onWord,
};