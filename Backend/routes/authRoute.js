import express from 'express'
import {signUp,signIn,deleteUser,updateUser} from '../controllers/authcontroller.js'
import verifyToken from '../middlewares/verifyToken.js';

const authRouter = express.Router();




authRouter.post('/signup',signUp);
authRouter.post('/signin',signIn);
authRouter.delete('/delete',verifyToken,deleteUser);
authRouter.put('/update',verifyToken, updateUser);






export default authRouter;