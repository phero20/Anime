import express from 'express'
import { fetchHomeData ,fetchCategoryData,fetchGenreData,fetchAnimeData,fetchProducerData} from '../controllers/fetchDataController.js';


const fetchDataRouter = express.Router()



fetchDataRouter.get('/getdata',fetchHomeData);
fetchDataRouter.get('/category/:name/:page',fetchCategoryData);
fetchDataRouter.get('/genre/:name/:page',fetchGenreData);
fetchDataRouter.get('/animedata/:id',fetchAnimeData);
fetchDataRouter.get('/producer/:name/:page',fetchProducerData);






export default fetchDataRouter;