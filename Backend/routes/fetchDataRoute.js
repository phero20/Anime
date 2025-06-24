import express from 'express'
import { fetchAnimeData ,fetchCategoryData,fetchGenreData} from '../controllers/fetchDataController.js';


const fetchDataRouter = express.Router()



fetchDataRouter.get('/getdata',fetchAnimeData);
fetchDataRouter.get('/category/:name/:page',fetchCategoryData);
fetchDataRouter.get('/genre/:name/:page',fetchGenreData);




export default fetchDataRouter;