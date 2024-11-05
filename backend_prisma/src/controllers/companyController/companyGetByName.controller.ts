import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/db/prisma";

/**
 * Controlador para obtener una compañía por su `company_name`.
 * @param req Request con el nombre de la compañía en los parámetros
 * @param res Response
 * @param next NextFunction
 */
export default async function companyGetByName(req: Request, res: Response, next: NextFunction) {
    const { name } = req.params;

    try {
        // Buscar la compañía en la base de datos por su `company_name`
        const company = await prisma.companies.findUnique({
            where: { company_name: name }
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Retornar los datos de la compañía
        return res.status(200).json({ company });
    } catch (error) {
        return next(error);
    }
}