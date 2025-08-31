import express from 'express'
import {signUp,signIn,deleteUser} from '../controllers/authcontroller.js'

const authRouter = express.Router();




authRouter.post('/signup',signUp);
authRouter.post('/signin',signIn);
authRouter.delete('/delete/:userId',deleteUser);







export default authRouter;