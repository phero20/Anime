import express from 'express'
import { fetchAnimeData ,fetchCategoryData} from '../controllers/fetchDataController.js';


const fetchDataRouter = express.Router()



fetchDataRouter.get('/getdata',fetchAnimeData);
fetchDataRouter.get('/category/:name/:page',fetchCategoryData);



export default fetchDataRouter;