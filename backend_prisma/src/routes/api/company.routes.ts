import { Router, Request, Response, NextFunction } from "express";
import companyGetById from '../../controllers/companyController/companyGetById.controller';

const router = Router();

router.get("/company/:id", (req: Request, res: Response, next: NextFunction) => {
    companyGetById(req, res, next);
});

export default router;