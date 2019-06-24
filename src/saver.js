const fs = require('fs');
const download = require('image-downloader');

const downloadImage = async (dest, url) => 
  download.image({ url, dest });


const saveImageStream = (path, stream) => {
  const out = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
      out.on('finish', resolve);
      out.on('error', reject);
      stream.pipe(out);
  });
}

const saveImageBuffer = (path, buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

module.exports = {
  saveImageStream,
  downloadImage,
  saveImageBuffer,
}
