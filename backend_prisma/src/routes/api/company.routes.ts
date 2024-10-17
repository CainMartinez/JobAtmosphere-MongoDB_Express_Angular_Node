import { Router, Request, Response, NextFunction } from "express";
import companyGetById from '../../controllers/companyController/companyGetById.controller';
import companyCreate from '../../controllers/companyController/companyCreate.controller';
import validatorListOne from '../../middleware/companyValidators/companyListOneValidator';
import validatorCreate from '../../middleware/companyValidators/companyCreateValidator';

const router = Router();

router.get("/company/:id", validatorListOne, (req: Request, res: Response, next: NextFunction) => {
    companyGetById(req, res, next);
});
router.post("/company", validatorCreate, (req: Request, res: Response, next: NextFunction) => {
    companyCreate(req, res, next);
});
export default router;