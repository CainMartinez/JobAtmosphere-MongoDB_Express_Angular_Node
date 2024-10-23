import { Router } from 'express';
import { roleMiddleware } from './middleware/roleMiddleware';  // Ajusta la ruta según la ubicación real del middleware

const router = Router();

// Ruta solo accesible para usuarios con el rol 'admin'
router.get('/', roleMiddleware('admin'), (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});

export default router;