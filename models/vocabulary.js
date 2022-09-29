const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    kanji: String,
    english: String,
    romaji: String,
    level: {
        type: Number,
        default: 0
    },
    learned: {
        type: Boolean,
        default: false
    }
});

const Vocab = mongoose.model('Vocab', vocabSchema);

module.exports = Vocab;