import prisma from "../prisma";

export default async function jobGetPrisma(slug: string) {
    const job = await prisma.jobs.findUnique({
        where: { slug }
    });
    return job;
}