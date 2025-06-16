require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const GPT_API = 'https://api.groq.com/openai/v1/chat/completions';

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Kirim placeholder "Jarvis sedang mikir..."
  await bot.sendMessage(chatId, '🧠 Jarvis sedang memproses...');

  try {
    const res = await axios.post(
      GPT_API,
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = res.data.choices[0].message.content;
    await bot.sendMessage(chatId, `🤖 Jarvis:\n${reply}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    await bot.sendMessage(chatId, '⚠️ Jarvis gagal berpikir. Coba lagi ya.');
  }
});
