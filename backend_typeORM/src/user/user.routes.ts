import { Router, Request, Response } from 'express';
import { UserController } from './user.controller';

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

export default router;