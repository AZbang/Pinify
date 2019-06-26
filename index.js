require('dotenv').config();
const Telegraf = require('telegraf')
const SocksProxyAgent = require('socks-proxy-agent')
const { errorEvent, sendAlbum, sendCollage } = require('./src/telegram');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { agent: new SocksProxyAgent(process.env.SOCKS_PROXY) },
});

bot.use(errorEvent)

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send pinterest board'))

bot.command('refs', sendAlbum)
bot.command('collage', sendCollage)

bot.launch()
