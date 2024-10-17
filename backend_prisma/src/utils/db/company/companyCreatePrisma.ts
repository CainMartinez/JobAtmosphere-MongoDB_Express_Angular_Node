import prisma from "../prisma";

interface CompanyData {
    username: string;
    company_name: string;
    password: string;
    email: string;
    location?: string;
    n_employee: number;
    description?: string;
}

export default async function companyCreatePrisma(data: CompanyData) {
    const newCompany = await prisma.companies.create({
        data: {
            username: data.username,
            company_name: data.company_name,
            password: data.password,
            email: data.email,
            location: data.location,
            n_employee: data.n_employee,
            description: data.description,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    return newCompany;
}