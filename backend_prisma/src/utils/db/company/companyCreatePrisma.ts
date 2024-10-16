import prisma from "../prisma";

interface RequireFields{
    username: string,
    password: string,
    
}

export default async function jobCreatePrisma(slug: string) {
    const job = await prisma.jobs.
    });
    return job;
}