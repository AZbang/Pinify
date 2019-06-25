require('dotenv').config();
const Telegraf = require('telegraf')
const SocksProxyAgent = require('socks-proxy-agent')
const { sendCollage } = require('./src/telegram');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { agent: new SocksProxyAgent(process.env.SOCKS_PROXY) },
});


bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send pinterest board'))
bot.on('message', sendCollage);

bot.launch();
