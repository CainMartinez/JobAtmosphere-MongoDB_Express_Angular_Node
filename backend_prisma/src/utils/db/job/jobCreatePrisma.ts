import prisma from "../prisma";

interface JobData {
    name: string;
    salary: number;
    description: string;
    company: string;
    images: string[];
    img: string;
    id_cat: string;
}

export default async function jobCreatePrisma(data: JobData) {
    const newJob = await prisma.jobs.create({
        data: {
            name: data.name,
            salary: data.salary,
            description: data.description,
            company: data.company,
            images: data.images,
            img: data.img,
            id_cat: data.id_cat,
            slug: `${data.name.toLowerCase().replace(/ /g, '-')}-${Math.random().toString(36).substr(2, 9)}`,
            favoritesCount: 0,
            comments: [],
            v: 0
        }
    });

    // Buscar la categoría con id_cat antes de actualizar
    const category = await prisma.categories.findFirst({
        where: { id_cat: data.id_cat }
    });

    if (!category) {
        throw new Error(`Category with id_cat ${data.id_cat} not found`);
    }

    // Actualizar la categoría añadiendo el id del nuevo job
    await prisma.categories.update({
        where: { id: category.id },  // Usamos el id único de la categoría
        data: {
            jobs: {
                push: newJob.id // Agregar el id del nuevo job al array de jobs
            }
        }
    });

    return newJob;
}