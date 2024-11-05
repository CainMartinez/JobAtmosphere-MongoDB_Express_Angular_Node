import { Request, Response, NextFunction } from "express";
import { param } from 'express-validator';
import { validationResult } from 'express-validator';
import prisma from "../../utils/db/prisma";

const companyGetByNameValidator = [
    param('name').isString().withMessage('Company name is required')
        .custom(async (value) => {
            const company = await prisma.companies.findUnique({ where: { company_name: value } });
            if (!company) {
                throw new Error('Company does not exist');
            }
            return true;
        }),

    // Middleware para manejar los errores de validación
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];

export default companyGetByNameValidator;