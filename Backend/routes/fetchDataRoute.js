import express from 'express'
import { fetchHomeData ,fetchCategoryData,fetchGenreData,fetchAnimeData,fetchProducerData,fetchEpisodesData,fetchEpisodesServerData} from '../controllers/fetchDataController.js';


const fetchDataRouter = express.Router()



fetchDataRouter.get('/getdata',fetchHomeData);
fetchDataRouter.get('/category/:name/:page',fetchCategoryData);
fetchDataRouter.get('/genre/:name/:page',fetchGenreData);
fetchDataRouter.get('/animedata/:id',fetchAnimeData);
fetchDataRouter.get('/producer/:name/:page',fetchProducerData);
fetchDataRouter.get('/episodes/:id',fetchEpisodesData);
fetchDataRouter.post('/episodes-server',fetchEpisodesServerData);








export default fetchDataRouter;