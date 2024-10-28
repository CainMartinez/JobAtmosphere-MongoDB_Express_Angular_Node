import { NextFunction, Request, Response } from "express";
import companyListOnePrisma from "../../utils/db/company/companyListOnePrisma";
import companyViewer from "../../view/companyViewer";

/**
 * Company controller that must receive a request.
 * The parameters of the request must have an email extracted from the token.
 * @param req Request with an optional JWT token verified
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function companyGetById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const company = await companyListOnePrisma(req); // Pasar req directamente
        if (!company) return res.sendStatus(404);

        const companyView = companyViewer(company);
        return res.status(200).json({ company: companyView });
    } catch (error) {
        return next(error);
    }
}