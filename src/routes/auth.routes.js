import {Router} from 'express';
import {login, register} from '../controllers/auth.controllers.js';

const auth_router = Router();

//login request
auth_router.post("/login", login);

//register request
auth_router.post("/register", register);


export default auth_router;
