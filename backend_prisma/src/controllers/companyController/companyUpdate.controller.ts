import { Request, Response, NextFunction } from "express";
import updateCompanyPrisma from "../../utils/db/company/companyUpdatePrisma";
import companyViewer from "../../view/companyViewer";

/**
 * Company controller to update an existing company using the ID from the token.
 * @param req Request with company data in the body
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function updateCompany(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Obtenemos el ID de la compañía desde el token
    const companyId = (req as any).user.id;
    const { location, n_employee, description } = req.body;

    try {
        // Llamamos a la función updateCompany pasando el id y los campos a actualizar
        const updatedCompany = await updateCompanyPrisma(companyId, { location, n_employee, description });

        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        const companyView = companyViewer(updatedCompany);
        return res.status(200).json({ company: companyView });
    } catch (error) {
        return next(error);
    }
}