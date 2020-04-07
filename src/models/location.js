const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

locationSchema.virtual('media', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'location'
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
