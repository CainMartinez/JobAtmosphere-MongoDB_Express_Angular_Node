import { Router, Request, Response } from 'express';
import { UserController } from './user.controller';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
const userController = new UserController();

// Ruta para el registro de usuarios
router.post('/register', async (req: Request, res: Response) => {
    await userController.register(req, res);  // Llamamos al controlador
});

// Ruta para el login de usuarios
router.post('/login', async (req: Request, res: Response) => {
    await userController.login(req, res);  // Llamamos al controlador
});

router.get('/test', roleMiddleware('recruiter'), (req, res) => {
    res.json({ message: 'Welcome, recruiter!' });
});

export default router;