require('dotenv').config();
const Parser = require('rss-parser');
const pinterest = require('pinterest-node-api');
const download = require('image-downloader');
const api = pinterest(process.env.PINTEREST_ACCESS_TOKEN);
const parser = new Parser();

const getBoardPins = async (board) => {
  const feed = await parser.parseURL(`https://www.pinterest.ru/${board}.rss`);
  const images = feed.items.map(item => item.content.match(/src="(.+)"/)[1]);
  const originals = images.map(img => img.replace('236x', 'originals'));
  return originals; 
}

const downloadImage = async (url) => {
  await download.image({ url, dest: './images' });
  console.log(`Image ${url} has been downloaded!`);
}

const downloadImages = async (images) => {
  const reqs = images.map(url => downloadImage(url));
  await Promise.all(reqs);
  console.log('Downloaded!');
}

const fetchImageFromBoard = async () => {
  const urls = await getBoardPins('azbango5/draw');
  await downloadImages(urls);
}

fetchImageFromBoard();
