const express = require('express');
const router = new express.Router();
const Location = require('../models/location');
const auth = require('../middleware/auth');
const axios = require('axios').default;
const decrypt = require('../middleware/decrypt');
const { getCountryCodeFromAddressComponents } = require('../utils/countries');
require('../db/mongoose');

// set location
router.post('/locations', auth, decrypt, async (req, res) => {
    try {
        const { GOOGLE_MAPS_GEOCODE_API, GOOGLE_MAPS_API_KEY } = process.env;
        const url = GOOGLE_MAPS_GEOCODE_API + GOOGLE_MAPS_API_KEY + 
            '&latlng=' + req.body.lat + ',' + req.body.lng;
        const geocodeRes = await axios.get(url);
        if(geocodeRes && geocodeRes.data && geocodeRes.data.results) {
            const {address_components, formatted_address} = geocodeRes.data.results[0];
            const countryCode = getCountryCodeFromAddressComponents(address_components);
            const location = new Location({
                ...req.body, 
                address: formatted_address,
                countryCode
            });
            await location.save();
            res.status(201).send(location._id);
        } else {
            throw new Error;
        }
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// get location
router.get('/locations', decrypt, async (req, res) => {
    const {query} = req.query;
    try {
        const locations = await Location.find({approved: true});
        if(query) {
            const result = locations.filter(location => {
                return location.name.toLowerCase().includes(query.toLowerCase());
            });
            res.send(result);
        } else res.send(locations);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// get locations for admin
router.get('/locations/admin', decrypt, async (req, res) => {
    const { countryCode } = req.query;
    try {
        const locations = await Location.find({countryCode});
        const populatedLocations = locations.map(async (location) => {
            await location.populate({
                path: 'media',
                match: { approved: false }
            }).execPopulate();
            return location;
        });

        const completed = await Promise.all(populatedLocations);

        const filteredLocations = completed.filter(location => location.media && location.media.length > 0);
        res.send(filteredLocations);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// get media given location
router.get('/locations/:id', decrypt, async (req, res) => {
    var sort = {};

    const {limit, skip, sortBy, isAdmin} = req.query;
    if(sortBy) {
        const parts = sortBy.split(':');
        sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1;
    }

    try {
        const {id} = req.params;
        const location = await Location.findById(id);
        await location.populate({
            path: 'media',
            match: {
                approved: !(isAdmin === "true")
            },  
            options: {
                limit: parseInt(limit), 
                skip: parseInt(skip),
                sort
            }
        }).execPopulate();

        const fullMedia = location.media.map(async m => {
            return await m.populate('owner').execPopulate();
        });

        const result = await Promise.all(fullMedia);
        res.send(result);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// update location
router.patch('/locations/:id', auth, decrypt, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        let location = await Location.findById(req.params.id);
        if(!location) {
            throw new Error;
        }

        updates.forEach(update => {
            location[update] = req.body[update];
        });

        await location.save();
        res.send(location);
    } catch(err) { 
        console.log(err);
        res.status(400).send(err);
    }
});

// delete location
router.delete('/locations/:id', auth, decrypt, async (req, res) => {
    try {
        let location = req.user.adminProperties ? await Location.findById(req.params.id) : {};
            
        if(!location) {
            throw new Error;
        }

        await location.remove();
        res.send();
    } catch(err) { 
        console.log(err);
        res.status(404).send(err);
    }
});

module.exports = router;
