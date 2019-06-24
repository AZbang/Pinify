const axios = require('axios');
const Parser = require('rss-parser');
const request = require('request');
const parser = new Parser();

const getBoardPins = async (board) => {
  const feed = await parser.parseURL(`https://www.pinterest.ru/${board}.rss`);
  const images = feed.items.map(item => item.content.match(/src="(.+)"/)[1]);
  const originals = images.map(img => img.replace('236x', 'originals'));
  
  const ready = [];
  for (let [i, img] of originals.entries()) {
    const is = await checkImage(img);
    ready.push(is ? img : images[i]);
  }

  return ready; 
}


const checkImage = async (url) => {
  return new Promise((resolve, reject) => {
    request({ url: url, method: 'HEAD' }, (err, res) => {
      if (err) return resolve(false);
      if (/4\d\d/.test(res.statusCode)) return resolve(false)
      return resolve(true);
    });
  });
}

module.exports = {
  getBoardPins,
}