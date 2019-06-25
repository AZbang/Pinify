const { getBoardPins } = require('./pinterest');
const { generateCollage } = require('./collage');
const { split } = require('./utils');

const sendCollage = async (ctx) => {
  try {
    await ctx.reply('Wait...');

    const board = ctx.message.text;
    const images = await getBoardPins(board);
    const parts = split(images, 10);

    for (let [i, part] of parts.entries()) {    
        await ctx.reply('Generate collage...');
        const stream = await generateCollage(part);
  
        await ctx.reply('Send collage...');
        await ctx.replyWithPhoto({ source: stream });
    }

  } catch(e) {
      console.log(e);
      await ctx.reply('Error!');
  }
}

const sendAlbum = async (ctx) => {
  try {
    await ctx.reply('Wait...');

    const board = ctx.message.text;
    const images = await getBoardPins(board);
    
    const media = images.map(image => ({ type: 'photo', media: image }));
    const parts = split(media, 10);

    await ctx.reply('Send albums...');

    for (let part of parts) 
        await ctx.replyWithMediaGroup(part);

  } catch(e) {
    console.log(e);
    await ctx.reply('Error!');
  }
}


module.export = {
  sendCollage,
  sendAlbum,
}