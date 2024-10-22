import { Router, Request, Response, NextFunction } from "express";
import jobCreate from "../../controllers/jobController/jobCreate.controller";
import validatorCreate from "../../middleware/jobValidators/jobCreateValidator";

const router = Router();

router.post("/jobs", validatorCreate, (req: Request, res: Response, next: NextFunction) => {
    jobCreate(req, res, next);
});
export default router;