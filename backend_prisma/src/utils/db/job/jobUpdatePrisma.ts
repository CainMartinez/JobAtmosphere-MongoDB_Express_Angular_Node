import prisma from "../prisma";  // Asegúrate de que este archivo apunte a la configuración correcta de Prisma
import { Jobs } from "@prisma/client";

/**
 * Update a job in the database by its slug.
 * @param slug The slug of the job to update
 * @param data The data to update: name, salary, and description
 * @returns The updated job
 */
export async function updateJob(
    slug: string,
    data: { name?: string; salary?: number; description?: string }
): Promise<Jobs | null> {
    try {
        const updatedJob = await prisma.jobs.update({
            where: { slug },
            data: {
                name: data.name,
                salary: data.salary,
                description: data.description
            }
        });

        return updatedJob;
    } catch (error) {
        console.error("Detailed Error:", error);  // Log the full error for debugging
        throw error;  // Throw the error directly to see the full Prisma error message in the response
    }
}