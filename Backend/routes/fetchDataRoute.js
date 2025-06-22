import express from 'express'
import { fetchAnimeData } from '../controllers/fetchDataController.js';


const fetchDataRouter = express.Router()



fetchDataRouter.get('/getdata',fetchAnimeData);


export default fetchDataRouter;