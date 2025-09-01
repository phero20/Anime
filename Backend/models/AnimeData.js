import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    episodes:[]
}, {
    timestamps: true
});

const AnimeData = mongoose.model('AnimeData', animeSchema);

export default AnimeData;
