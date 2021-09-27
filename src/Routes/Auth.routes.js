import { Router } from 'express';
import { AuthController } from '../Controller/Auth.controller';
import { AuthBodyValidator } from '../Middlewares/AuthBodyValidator.middleware'

const router = Router();
const Controller = new AuthController();

router.post('/api/signup', AuthBodyValidator, (request, response)=>{
    Controller.signup(request, response)
})

router.post('/api/signin',AuthBodyValidator, (request, response)=>{
    Controller.signin(request, response)
})

router.get('/api/users', (request, response)=>{
    Controller.getUser(request, response)
})
export default router;