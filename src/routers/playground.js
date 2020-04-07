const express = require('express');
const router = new express.Router();
const upload = require('../utils/multer');
const compress = require('../utils/compress');
require('../db/mongoose');

// send compressed version
router.post('/compress', upload.single('media'), async (req, res) => {
    try {
        if(!req.file || !req.file.buffer) throw new Error;
        const newBuffer = await compress(req.file.buffer);
        res.send(newBuffer);
    } catch(err) { 
        console.log(err);
        res.status(404).send(err);
    }
});

module.exports = router;
