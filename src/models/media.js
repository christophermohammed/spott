const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    upvoters: [{
        type: String,
        required: true
    }],
    downvoters: [{
        type: String,
        required: true
    }],
    popularity: {
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});

mediaSchema.methods.toJSON = function() {
    const media = this;
    const mediaObject = media.toObject();

    delete mediaObject.buffer;

    return mediaObject;
}

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
