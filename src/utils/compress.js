const imagemin = require('imagemin');
const imageminPngQuant = require('imagemin-pngquant');
const imageminmozjpeg = require('imagemin-mozjpeg');

const compress = async (buffer) => {
    const bufferSize = buffer.toString().length;
    console.log("old: " + bufferSize);

    var newBuffer = buffer;

    if(bufferSize >= 4000000) {
        var qualityRatio = 4000000 / bufferSize;
        if(qualityRatio > 0.8) qualityRatio = 0.8;
        const minQuality = (qualityRatio - 0.1) < 0 ? 0 : qualityRatio - 0.1;

        newBuffer = await imagemin.buffer(buffer, {
            plugins: [
                imageminmozjpeg({
                    quality: qualityRatio * 100
                }),
                imageminPngQuant({
                    quality: [
                        minQuality,
                        qualityRatio
                    ]
                })
            ]
        });
    }

    console.log("new: " + newBuffer.toString().length);
    return newBuffer;
}

module.exports = compress;
