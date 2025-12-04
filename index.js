require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

app.use(express.json());

// Главное меню
bot.start((ctx) => {
  const webAppUrl = `${process.env.VERCEL_URL}/webapp`;
  ctx.reply('✨ Добро пожаловать в Новогоднее Заклинание Дракона 2026!', {
    reply_markup: {
      keyboard: [[{ text: 'Запустить квест ✨', web_app: { url: webAppUrl } }]],
      resize_keyboard: true
    }
  });
});

// Обработка deep linking (QR-коды)
bot.command('start', (ctx) => {
  if (ctx.startPayload) {
    // Автоматически открываем веб-приложение и передаём параметр
    const webAppUrl = `${process.env.VERCEL_URL}/webapp?item=${ctx.startPayload}`;
    ctx.reply('Сканирование засчитано! Открываем квест...', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Открыть квест', web_app: { url: webAppUrl } }]]
      }
    });
  } else {
    bot.start(ctx);
  }
});

// Статические файлы Mini App
app.use('/webapp', express.static(path.join(__dirname, '../webapp')));

// Webhook для Vercel
app.post('/webhook', bot.webhookCallback('/webhook'));
app.get('/webhook', (req, res) => res.send('OK'));

// Для Vercel
app.get('*', (req, res) => {
  res.send('Квест Дракона работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});