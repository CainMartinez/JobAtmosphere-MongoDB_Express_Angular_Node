import { jobs } from "@prisma/client";

export default function jobViewer(job: jobs) {
    const productView = {
        id: job.id,
        slug: job.slug,
        
    };
    return productView;
}