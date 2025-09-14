import User from '../models/authModel.js';
import AnimeData from '../models/AnimeData.js';
import Episode from '../models/EpisodeModel.js';

// Add to favorites
export const addToFavorites = async (req, res) => {
    try {
        console.log(req.body)
        const { anime } = req.body;
        const userId = req.body.userId; // from verifyToken middleware

        // Check if anime exists in AnimeData, if not create it
        let animeDoc = await AnimeData.findOne({ id: anime.id });
        if (!animeDoc) {
            animeDoc = await AnimeData.create({
                id: anime.id,
                name: anime.name,
                poster: anime.poster,
                episodes: anime.episodes
            });
        }

        // Add to user's favorites if not already added
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already in favorites
        if (user.favorites.includes(animeDoc._id)) {
            return res.status(400).json({
                success: false,
                message: 'Anime already in favorites'
            });
        }

        // Add to favorites
        user.favorites.push(animeDoc._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Added to favorites successfully',
            anime: animeDoc
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message || 'Error adding to favorites'
        });
    }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const { animeId } = req.params;
        const userId = req.body.userId;

        const animeDoc = await AnimeData.findOne({ id: animeId });
        if (!animeDoc) {
            return res.status(404).json({
                success: false,
                message: 'Anime not found'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove from favorites
        user.favorites = user.favorites.filter(id => !id.equals(animeDoc._id));
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Removed from favorites successfully',
            animeId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error removing from favorites'
        });
    }
};

// Add to watchlist
export const addToWatchlist = async (req, res) => {
    try {
        const { anime } = req.body;
        const userId = req.body.userId;

        // Check if anime exists in AnimeData, if not create it
        let animeDoc = await AnimeData.findOne({ id: anime.id });
        if (!animeDoc) {
            animeDoc = await AnimeData.create({
                id: anime.id,
                name: anime.name,
                poster: anime.poster,
                episodes: anime.episodes
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already in watchlist
        if (user.watchlist.includes(animeDoc._id)) {
            return res.status(400).json({
                success: false,
                message: 'Anime already in watchlist'
            });
        }

        // Add to watchlist
        user.watchlist.push(animeDoc._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Added to watchlist successfully',
            anime: animeDoc
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error adding to watchlist'
        });
    }
};

// Remove from watchlist
export const removeFromWatchlist = async (req, res) => {
    try {
        const { animeId } = req.params;
        const userId = req.body.userId;

        const animeDoc = await AnimeData.findOne({ id: animeId });
        if (!animeDoc) {
            return res.status(404).json({
                success: false,
                message: 'Anime not found'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove from watchlist
        user.watchlist = user.watchlist.filter(id => !id.equals(animeDoc._id));
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Removed from watchlist successfully',
            animeId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error removing from watchlist'
        });
    }
};

// Get user's anime lists
export const getUserAnimeLists = async (req, res) => {
    try {
        const userId = req.body.userId;

        const user = await User.findById(userId)
            .populate('favorites')
            .populate('watchlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            favorites: user.favorites,
            watchlist: user.watchlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching anime lists'
        });
    }
};


export const addToHistory = async (req, res) => {
  const { episodeId, server, category, EpisodeImage, animeId, date } = req.body;

  let existingEpisode = await Episode.findOne({
    animeId,
    episodeId,
    server,
    category,
  });

  if (!existingEpisode) {
    const newEpisode = new Episode({
      animeId,
      episodeId,
      category,
      server,
      EpisodeImage,
      date: date || new Date().toISOString().split("T")[0],
    });
    existingEpisode = await newEpisode.save();
  }

  const episodeData = existingEpisode.toObject();

  const userId = req.body.userId;
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      user.history.push(existingEpisode._id);
      await user.save();
    }
  }

  return res.json({ success: true, episodeData });
};