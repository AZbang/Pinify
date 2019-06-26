const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

const getBoardPins = async (board) => {
  const feed = await parser.parseURL(`https://www.pinterest.ru/${board}.rss`);
  const images = feed.items.map(item => item.content.match(/src="(.+)"/)[1]);
  return images.map(img => img.replace('236x', '736x'));
}

module.exports = {
  getBoardPins,
}