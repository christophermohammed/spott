const express = require('express');
const router = new express.Router();
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../utils/multer');
const decrypt = require('../middleware/decrypt');
require('../db/mongoose');

// create / sign up
router.post('/api/users', decrypt, async (req, res) => {
    try {
        let user = new User(req.body);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// login
router.post('/api/users/login', decrypt, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// logout
router.post('/api/users/logout', auth, decrypt, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

// logout all
router.post('/api/users/logoutAll', auth, decrypt, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

// get your media
router.get('/api/users/me/media', auth, decrypt, async (req, res) => {
    await req.user.populate('media').execPopulate();
    res.send(req.user.media);
});

// get you
router.get('/api/users/me', auth, decrypt, async (req, res) => {
    res.send(req.user);
});

// get someone
router.get('/api/users', auth, decrypt, async (req, res) => {
    try {
        if (!req.user.adminProperties) throw new Error;
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error('User not found');
        }
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(404).send();
    }
});

// get avatar
router.get('/api/users/:id/avatar', decrypt, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error;
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// update
router.patch('/api/users/me', auth, decrypt, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const user = req.user;
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// update someone
router.patch('/api/users/:id', auth, decrypt, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        if (!req.user.adminProperties) throw new Error;
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('Could not find user');
        }
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// delete user
router.delete('/api/users/:id', auth, decrypt, async (req, res) => {
    try {
        if (!req.user.adminProperties) throw new Error;
        const user = await User.findById(req.params.id);
        await user.remove();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// delete avatar
router.delete('/api/users/me/avatar', auth, decrypt, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = router;
