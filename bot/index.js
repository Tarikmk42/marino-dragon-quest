require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());

// Главная кнопка
bot.start((ctx) => {
  ctx.reply('✨ Заклинание Дракона 2026', {
    reply_markup: {
      keyboard: [[{ text: 'Запустить квест ✨', web_app: { url: process.env.VERCEL_URL + '/webapp' } }]],
      resize_keyboard: true
    }
  });
});

// QR-коды с параметрами
bot.command('start', (ctx) => {
  if (ctx.startPayload) {
    const url = `${process.env.VERCEL_URL}/webapp?item=${ctx.startPayload}`;
    ctx.reply('Скан засчитан! Открываем квест...', {
      reply_markup: { inline_keyboard: [[{ text: 'Открыть квест', web_app: { url } }]] }
    });
  }
});

// Веб-приложение
app.use('/webapp', express.static(path.join(__dirname, '../webapp')));
app.use(bot.webhookCallback('/webhook'));

app.get('*', (req, res) => res.send('Квест работает!'));

module.exports = app;
