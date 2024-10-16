import { Router, Request, Response, NextFunction } from "express";
import jobGet from '../../controllers/jobController/jobGet';
const router = Router();

router.get("/jobs/:slug", (req: Request, res: Response, next: NextFunction) => {
    jobGet(req, res, next);
});

export default router;