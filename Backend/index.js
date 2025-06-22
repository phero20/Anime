import express from "express";
import cors from "cors";
import fetchDataRouter from "./routes/fetchDataRoute.js";

const app = express();
const PORT = process.env.PORT || 6789;

app.use(express.json());
app.use(cors());

app.use('/api/anime',fetchDataRouter)

app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => {
  console.log("server running on port" + PORT);
});
