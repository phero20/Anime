import express from 'express'
import {signUp} from '../controllers/authcontroller.js'

const authRouter = express.Router();




authRouter.post('/signup',signUp)





export default authRouter;