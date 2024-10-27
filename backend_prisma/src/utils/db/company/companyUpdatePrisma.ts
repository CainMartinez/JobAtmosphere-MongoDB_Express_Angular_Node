import prisma from "../prisma";
import { Companies } from "@prisma/client";

/**
 * Update a company in the database by its ID.
 * @param id The ID of the company to update
 * @param data The data to update: location, n_employee, and description
 * @returns The updated company
 */
export default async function updateCompany(
    id: string,
    data: { location?: string; n_employee?: number; description?: string }
): Promise<Companies | null> {
    try {
        const updatedCompany = await prisma.companies.update({
            where: { id },
            data: {
                location: data.location,
                n_employee: data.n_employee,
                description: data.description,
                updatedAt: new Date()  // Actualizar la fecha a la fecha actual
            }
        });

        return updatedCompany;
    } catch (error) {
        console.error("Error updating company:", error);
        throw new Error("Failed to update company.");
    }
}