import express from 'express'
import {signUp,signIn,deleteUser,updateUser} from '../controllers/authcontroller.js'

const authRouter = express.Router();




authRouter.post('/signup',signUp);
authRouter.post('/signin',signIn);
authRouter.delete('/delete/:userId',deleteUser);
authRouter.put('/update/:userId',updateUser);






export default authRouter;