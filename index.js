require('dotenv').config();
const fs = require('fs');
const Telegraf = require('telegraf')
const SocksProxyAgent = require('socks-proxy-agent')
const { getBoardPins } = require('./src/pinterest');
const { generateCollage } = require('./src/collage');
const { saveImageStream } = require('./src/saver');
const { split } = require('./src/utils');

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { agent: new SocksProxyAgent(process.env.SOCKS_PROXY) },
});


const sendPhotos = async (ctx, images) => {
    const media = images.map(image => ({ type: 'photo', media: image }));
    const partitions = split(media, 10);

    for (let part of partitions) 
        await ctx.replyWithMediaGroup(part);
}

bot.use((ctx, next) => {
    const start = new Date()
    return next(ctx).then(() => {
        const ms = new Date() - start
        console.log('Response time %sms', ms)
    })
})

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send pinterest board'))

bot.on('message', async (ctx) => {
    try {
        await ctx.reply('Wait...');
        const board = ctx.message.text;
        const images = await getBoardPins(board);
        const parts = split(images, 10);
        // + await sendPhotos(ctx, images);

        for (let [i, part] of parts.entries()) {
            const path = `${process.cwd()}/collages/${board.replace('/', '_')}_${i}.png`;

            await ctx.reply('Generate collage...');
            const stream = await generateCollage(part);
            await saveImageStream(path, stream);

            await ctx.reply('Send collage...');
            await ctx.replyWithPhoto({ source: path });
        }

    } catch(e) {
        console.log(e);
        await ctx.reply('Error!');
    }
});

bot.launch();
