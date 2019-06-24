const { createCanvas, loadImage } = require('canvas');

const getImage = (url) => loadImage(url)
    .then((img) => Promise.resolve(img))
    .catch(() => Promise.resolve(null));

const loadImages = async (urls) => {
    const reqs = urls.map(url => getImage(url));
    const images = await Promise.all(reqs);
    return images.filter(img => img);
}

const computeCollage = ({ canvasWidth, images }) => {
    const h = Math.min(...images.map(img => img.height));
    const position = { x: 0, y: 0 };

    return images.map((img, i) => {
        const scale = h/img.height;
        const w = Math.round(img.width*scale);

        if (i === 0) {
            Object.assign(position, { x: w, y: 0 });
            return { x: 0, y: 0, w, h, img };
        }
        
        const { x, y } = position;
        position.x = x > canvasWidth ? 0 : x+w;
        position.y = x > canvasWidth ? y+h : y;
        return { x, y, w, h, img };
    });
}

const computeSizeCollage = (data) => {
    const xLenghts = data.map(img => img.x+img.w);
    const yLenghts = data.map(img => img.y+img.h);
    const xMax = Math.max(...xLenghts);
    const yMax = Math.max(...yLenghts);
    return { width: xMax, height: yMax };
}

const renderCollage = (width, height, data) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = 20;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    data.forEach(({ img, x, y, w, h }) => {
        ctx.drawImage(img, x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    });

    return canvas;
}


const generateCollage = async (urls) => {
    const images = await loadImages(urls);
    const data = computeCollage({ canvasWidth: 1000, images });
    const { width, height } = computeSizeCollage(data);

    const collage = await renderCollage(width, height, data);
    return collage.createPNGStream();

}

module.exports = {
    generateCollage,
}
