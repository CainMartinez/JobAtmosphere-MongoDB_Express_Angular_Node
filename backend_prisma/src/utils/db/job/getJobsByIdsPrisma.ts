import prisma from "../prisma";

/**
 * Función para obtener un array de jobs usando sus IDs.
 * @param jobIds Array de IDs de jobs
 * @returns Array de jobs
 */
export default async function getJobsByIds(jobIds: string[]) {
    return await prisma.jobs.findMany({
        where: { id: { in: jobIds } }
    });
}