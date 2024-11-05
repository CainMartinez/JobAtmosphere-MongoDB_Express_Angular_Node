import { Router, Request, Response, NextFunction } from "express";
import companyGetByEmail from '../../controllers/companyController/companyGetByEmail.controller';
import companyCreate from '../../controllers/companyController/companyCreate.controller';
import validatorCreate from '../../middleware/companyValidators/companyCreateValidator';
import { roleMiddleware } from '../../middleware/companyValidators/RoleMiddleware';
import companyLogin from "../../controllers/companyController/companyLogin.controller";
import validatorLogin from "../../middleware/companyValidators/companyLoginValidator";
import authMiddleware from "../../middleware/authMiddleware";
import { updateFollowers } from "../../controllers/companyController/companyFollowers.controller";
import updateCompany from "../../controllers/companyController/companyUpdate.controller";
import { companyDashboard } from "../../controllers/companyController/companyDashboard.controller";
import getCompanyJobs from "../../controllers/jobController/companyJobs.controller";

const router = Router();

// Authentification
router.post('/company/login', validatorLogin, (req: Request, res: Response, next: NextFunction) => {
    companyLogin(req, res, next);
});

// Register
router.post("/company/register", validatorCreate, (req: Request, res: Response, next: NextFunction) => {
    companyCreate(req, res, next);
});

// Profile
router.get("/company/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    companyGetByEmail(req, res, next);
});

// Dashboard
router.get('/company/dashboard', roleMiddleware('company'), (req: Request, res: Response) => {
    companyDashboard(req, res);
});

// Follow
router.put('/follow/:companyId', (req: Request, res: Response) => {
    updateFollowers(req, res);
});

// Update
router.put(
    "/company",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateCompany(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

// Get company
router.get(
    "/company",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await companyDashboard(req, res);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/job",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getCompanyJobs(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;