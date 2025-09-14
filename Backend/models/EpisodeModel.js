import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['sub', 'dub']
  },
  server: {
    type: String,
  },
  animeId: {
    type: String,
    required: true,
  },
  episodeId: {
    type: String,
    required: true,
  },
  EpisodeImage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

episodeSchema.index({ animeId: 1, episodeId: 1, category: 1, server: 1 }, { unique: true });

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;