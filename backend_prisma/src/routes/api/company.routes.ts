import { Router, Request, Response, NextFunction } from "express";
import companyGetById from '../../controllers/companyController/companyGetById.controller';
import validatorListOne from '../../middleware/companyValidators/companyListOneValidator';

const router = Router();

router.get("/company/:id", validatorListOne, (req: Request, res: Response, next: NextFunction) => {
    companyGetById(req, res, next);
});

export default router;