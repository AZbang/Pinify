const { getBoardPins } = require('./pinterest');
const { generateCollage } = require('./collage');
const { split } = require('./utils');

const errorEvent = async (ctx, next) => {
  try {
    await next(ctx);
  } catch(e) {
    await ctx.reply('Error :(');
  }
}

const sendCollage = async (ctx) => {
  await ctx.reply('Wait...');

  const [msg, board, amt] = ctx.message.text.split(' ');
  const images = await getBoardPins(board);
  const parts = split(images, amt || 10);

  for (let [i, part] of parts.entries()) {    
    await ctx.reply('Generate collage...');
    const stream = await generateCollage(part);

    await ctx.reply('Send collage...');
    await ctx.replyWithPhoto({ source: stream });
  }
}

const sendAlbum = async (ctx) => {
  await ctx.reply('Wait...');

  const board = ctx.message.text.split(' ')[1];
  const images = await getBoardPins(board);
    
  const media = images.map(image => ({ type: 'photo', media: image }));
  const parts = split(media, 10);

  await ctx.reply('Send albums...');
  for (let part of parts) await ctx.replyWithMediaGroup(part);
}

module.exports = {
  errorEvent,
  sendCollage,
  sendAlbum,
}
