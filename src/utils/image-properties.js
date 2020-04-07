const sharp = require('sharp');

const jpegProps = (data) => {      // data is an array of bytes
    var off = 0;
    while(off<data.length) {
        while(data[off]==0xff) off++;
        var mrkr = data[off];  off++;

        if(mrkr==0xd8) continue;        // SOI
        if(mrkr==0xd9) break;           // EOI
        if(0xd0<=mrkr && mrkr<=0xd7) continue;
        if(mrkr==0x01) continue;        // TEM

        var len = (data[off]<<8) | data[off+1];  off+=2;  

        if(mrkr==0xc0) return {
            bpc : data[off],            // precission (bits per channel)
            w   : (data[off+1]<<8) | data[off+2],
            h   : (data[off+3]<<8) | data[off+4],
            cps : data[off+5]           // number of color components
        };
        off+=len-2;
    }
}

const resize = async (width, buffer) => {
    const res = await sharp(buffer).rotate().resize(width).withMetadata().jpeg().toBuffer();
    //console.log('desired width: ', width, 'actual width: ', jpegProps(res).w);
    return res;
}

module.exports = resize;
