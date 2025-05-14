const meta = {
  name: "uid",
  aliases: ["id"],
  version: "1.0.0",
  type: "anyone",
  category: "system",
  description: "Get user ID and profile link",
  cooldown: 0,
  prefix: "both",
  guide: "uid",
  author: "TOSHI"
};

async function onStart({ bot, message, msg }) {
  const userInfo = msg.reply_to_message ? msg.reply_to_message.from : msg.from;
  const name = userInfo.first_name + ' ' + (userInfo.last_name || '');
  const usernameOrId = userInfo.username ? `https://t.me/${userInfo.username}` : `https://t.me/${userInfo.id}`;
  const result = `Name: ${name}\nUser ID: <code>${userInfo.id}</code>\nProfile: ${usernameOrId}`;
  await message.reply(result, { parse_mode: "HTML" });
}

module.exports = { meta, onStart };