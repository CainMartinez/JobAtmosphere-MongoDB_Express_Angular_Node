import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import companyGetById from '../../controllers/companyController/companyGetById.controller';
import companyCreate from '../../controllers/companyController/companyCreate.controller';
import validatorListOne from '../../middleware/companyValidators/companyListOneValidator';
import validatorCreate from '../../middleware/companyValidators/companyCreateValidator';
import { roleMiddleware } from '../../middleware/companyValidators/RoleMiddleware';
import companyLogin from "../../controllers/companyController/companyLogin.controller";
import validatorLogin from "../../middleware/companyValidators/companyLoginValidator";
import { updateFollowers } from "../../controllers/companyController/companyFollowers.controller";
import updateCompany from "../../controllers/companyController/updateCompanty.controller";
import authMiddleware from "../../middleware/authMiddleware";

const router = Router();

router.get("/company/:id", validatorListOne, (req: Request, res: Response, next: NextFunction) => {
    companyGetById(req, res, next);
});
router.post("/company/register", validatorCreate, (req: Request, res: Response, next: NextFunction) => {
    companyCreate(req, res, next);
});
router.get('/company/dashboard', roleMiddleware('company'), (req, res) => {
    res.json({ message: 'Welcome to the company dashboard' });
});
router.post('/company/login', validatorLogin, (req: Request, res: Response, next: NextFunction) => {
    companyLogin(req, res, next);
});
router.put('/company/follow/:companyId', (req: Request, res: Response) => {
    updateFollowers(req, res);
});
router.put(
    "/company",
    authMiddleware,  // Middleware de autenticación
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateCompany(req, res, next);
        } catch (error) {
            next(error);  // Manejo de errores
        }
    }
);
router.get(
    "/company",
    authMiddleware,  // Middleware de autenticación
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await companyGetById(req, res, next);
        } catch (error) {
            next(error);  // Manejo de errores
        }
    }
);

export default router;