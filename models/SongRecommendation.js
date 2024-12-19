const mongoose = require('mongoose');

const songRecommendationSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true,
        maxlength: 100,
    },
    song: {
        type: String,
        required: true,
        maxlength: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SongRecommendation', songRecommendationSchema);
