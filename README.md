# OwnersV2 Telegram Bot

The `OwnersV2 Telegram Bot` is a simple and customizable bot for Telegram. It offers admin tools, interactive features, and event handling to enhance group management and engagement.

---

## Features

- **Custom Commands**: Easy to create and manage.
- **Admin Tools**: Efficient member and group management.
- **Event Handling**: Welcome/goodbye messages for group members.
- **Role-Based Access**: Command permissions for admins, VIPs, or all users.
- **Media Support**: Send and manage text, images, videos, and audio.
- **Interactive Elements**: Supports buttons, callbacks, and message editing.
- **Keyword Triggers**: Auto-reply to specific words or phrases.
- **Flexible Command Prefix**: Supports commands with or without prefixes.
- **Cooldown System**: Prevent command spam with delays.
  
---

## Setup

### Prerequisites

1. **Bot Token**  
   Get it from [BotFather](https://t.me/BotFather) on Telegram.  
   ![BotFather Preview](https://i.imgur.com/1eBNpbK.jpeg)

2. **Verification with Manybot**  
   After obtaining the token, verify it to get your bot's URL (`t.me/<bot_username>`) using [Manybot](https://t.me/Manybot).  
   ![Manybot Preview](https://i.imgur.com/uENHXlz.jpeg)

3. **Admin ID**  
   Retrieve it via [MyIDBot](https://t.me/myidbot).  
   ![MyIDBot Preview](https://i.imgur.com/pwwMlg1.jpeg)
   
### Configuration
1. Add the Bot Token to `setup/states.json`.
2. Add the Admin ID to `setup/settings.json`.
3. For VIP add the Admin ID to
`setup/vip.json`.

### Run the Bot
1. Fork this Repo.

2. Add the following build command:
   ```bash
   npm install
   ```

3. Use the following start command:
   ```bash
   node index.js
   ```

You can deploy the bot on the following platforms:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Koyeb](https://koyeb.com)
- [Litegix](https://litegix.com)
- Pterodactyl Panels (self-managed)
---

## Bot Command Structure

Commands in Ownersv2 follow a specific structure for consistency and maintainability. Here's the basic template:

```javascript
const meta = {
  name: "commandname",      // Command name (required)
  version: "1.0.0",        // Command version
  aliases: [],             // Alternative command names
  description: "",         // Command description
  author: "",             // Command author
  prefix: "both",         // "both" for ! and / prefix support
  category: "",           // Command category
  type: "anyone",         // Permission type (anyone, admin, vip)
  cooldown: 5,            // Cooldown in seconds
  guide: ""               // Usage guide
};

async function onStart({ bot, args, message, msg, usages }) {
  // Command logic here
}

module.exports = { meta, onStart };
```

### Message Handling Methods

1. **Text Messages**
```javascript
// Reply to message
message.reply("Hello World!");

// Send new message
bot.sendMessage(msg.chat.id, "Hello World!");
```

2. **Image Messages**
```javascript
// Send image from URL
bot.sendPhoto(msg.chat.id, "https://example.com/image.jpg", {
  caption: "Optional caption"
});

// Send image from local file
bot.sendPhoto(msg.chat.id, "./path/to/image.jpg", {
  caption: "Optional caption"
});
```

3. **Video Messages**
```javascript
// Send video from URL
bot.sendVideo(msg.chat.id, "https://example.com/video.mp4", {
  caption: "Optional caption"
});

// Send video from local file
bot.sendVideo(msg.chat.id, "./path/to/video.mp4", {
  caption: "Optional caption"
});
```

4. **Audio Messages**
```javascript
// Send audio from URL
bot.sendAudio(msg.chat.id, "https://example.com/audio.mp3", {
  caption: "Now playing"
});

// Send audio from local file
bot.sendAudio(msg.chat.id, "./path/to/audio.mp3", {
  caption: "Now playing"
});
```

5. **Delete Messages**
```javascript
// Delete a specific message
bot.deleteMessage(msg.chat.id, msg.message_id);

// Delete bot's reply after delay (in milliseconds)
const reply = await message.reply("This will be deleted");
setTimeout(() => {
  bot.deleteMessage(msg.chat.id, reply.message_id);
}, 5000); // Deletes after 5 seconds
```

6. **Edit Messages**
```javascript
// Edit Media (e.g., replace photo in a message)
bot.editMessageMedia(
  {
    type: "photo",
    media: "https://example.com/new-neko.jpg",
    caption: "Here's another neko!",
  },
  {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🔁",
            callback_data: JSON.stringify({
              command: "neko",
              gameMessageId: msg.message_id
            }),
          },
        ],
      ],
    },
  }
);
```

## Bot Handler

The bot is modular, with each functionality handled by different files in the `core/handle` directory:

1. **Callback Handler** (`callback.js`)
   - Handles Telegram bot callback queries.
   - Parses callback data and executes the `onCallback` method of relevant commands.
   - Provides error handling for invalid callbacks.

2. **Chat Handler** (`chat.js`)
   - Processes general chat interactions.
   - Iterates through commands with `onChat` handlers and executes them as required.

3. **Command Handler** (`command.js`)
   - Detects and processes commands invoked by users.
   - Validates permissions, cooldowns, and usage.
   - Executes the `onStart` method of the relevant command.

4. **Event Handler** (`event.js`)
   - Manages system events like user joining or leaving.
   - Identifies event type and executes the relevant event handler.

5. **Reply Handler** (`reply.js`)
   - Processes replies to bot messages.
   - Identifies original commands from replied messages and executes their `onReply` method.

6. **Word Handler** (`word.js`)
   - Detects keywords or no-prefix commands in messages.
   - Executes the `onWord` method for matching commands.

---

## Support

For issues, open an issue in the repo or contact me on:
- [Facebook](https://www.facebook.com/known.as.kaizenji)

---

## Credits

The `OwnersV2 Telegram Bot` is a modified chatbot by the **CEO** of the `OwnersV2 company.`

This Repo is originally from 
- [ShawnDesu](https://github.com/shawndesu/Chaldea.git)
