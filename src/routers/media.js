const express = require('express');
const router = new express.Router();
const Media = require('../models/media');
const upload = require('../utils/multer');
const auth = require('../middleware/auth');
const decrypt = require('../middleware/decrypt');
const compress = require('../utils/compress');
const resize = require('../utils/image-properties');
const blobService = require('../utils/blobstorage');
const { PassThrough } = require('stream');
require('../db/mongoose');

const containerName = process.env.NODE_ENV === 'production' ? 'prod-media' : 'media';

// set media
router.post('/media', auth, upload.single('media'), decrypt, async (req, res) => {
    try {
        await blobService.createContainerIfDoesNotExist(containerName);
        if(!req.file || !req.file.buffer) throw new Error;

        const newBuffer = await compress(req.file.buffer);
        let media = new Media({
            ...req.body,
            owner: req.user._id,
            upvoters: [],
            downvoters: [],
            popularity: 0
        });

        await blobService.uploadString(containerName, media._id + '.jpg', newBuffer);
        await media.save();
        res.status(201).send();
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// get media by id 
router.get('/media/:id/:width', async (req, res) => {
    try {
        const {width, id} = req.params;
        let parsedWidth = parseInt(width);

        let stream = new PassThrough();
        var data = [];

        stream.on('data', d => data.push(d));
        await blobService.downloadBlob(containerName, id + '.jpg', stream);
        let mergedBuffer = Buffer.concat(data);

        let newBuffer = await resize(parsedWidth, mergedBuffer);
        res.set('Content-Type', 'image/jpg');
        res.send(newBuffer);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// update media
router.patch('/media/:id', auth, decrypt, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        let media = await Media.findById(req.params.id);
        if(!media) {
            throw new Error;
        }

        updates.forEach(update => {
            media[update] = req.body[update];
        });
        await media.populate('owner').execPopulate();
        media.popularity = media.upvoters.length - media.downvoters.length;

        await media.save();
        res.send(media);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// delete media
router.delete('/media/:id', auth, decrypt, async (req, res) => {
    try {
        let media = req.user.adminProperties ? 
            await Media.findById(req.params.id) : 
            await Media.findOne({_id: req.params.id, owner: req.user._id});
        
        await blobService.deleteBlob(containerName, media._id + '.jpg');

        if(!media) {
            throw new Error;
        }
        await media.remove();
        res.send();
    } catch(err) { 
        console.log(err);
        res.status(404).send(err);
    }
});

module.exports = router;
