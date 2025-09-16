import express from "express";
import verifyToken from '../middlewares/verifyToken.js';

import {
  addToFavorites,
  addToWatchlist,
  getUserAnimeLists,
  removeFromFavorites,
  removeFromWatchlist,
  addToHistory,
  getUserHistory
} from "../controllers/userAnimeController.js";


const userAnimeRouter = express.Router();

userAnimeRouter.post("/favorites", verifyToken, addToFavorites);
userAnimeRouter.delete("/favorites/:animeId", verifyToken, removeFromFavorites);
userAnimeRouter.post("/watchlist", verifyToken, addToWatchlist);
userAnimeRouter.delete("/watchlist/:animeId", verifyToken, removeFromWatchlist);
userAnimeRouter.get("/anime-lists", verifyToken, getUserAnimeLists);
userAnimeRouter.post("/history", verifyToken, addToHistory);
userAnimeRouter.get("/history", verifyToken, getUserHistory);
export default userAnimeRouter;
