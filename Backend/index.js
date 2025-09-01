import "dotenv/config";
import express from "express";
import cors from "cors";
import fetchDataRouter from "./routes/fetchDataRoute.js";
import authRouter from "./routes/authRoute.js";
import proxyRouter from "./routes/proxyRoute.js";
import connectDB from "./configs/mongoDBconfig.js";
import userAnimeRouter from "./routes/userAnime.js";

const app = express();
const PORT = process.env.PORT || 6789;

app.use(express.json());
app.use(cors());
connectDB();
app.use('/api/anime',fetchDataRouter)
app.use('/api/auth',authRouter)
app.use('/api/userAnime',userAnimeRouter)

app.use('/api/proxy',proxyRouter)

app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => {
  console.log("server running on port" + PORT);
});
