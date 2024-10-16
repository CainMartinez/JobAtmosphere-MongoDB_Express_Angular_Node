import express, { Request, Response } from "express";
import companyRouter from "./routes/api/company.routes";
import cors from 'cors';

const allowedOrigins = ['http://localhost:4200'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

const app = express();
app.use(cors(options));

app.use(express.json());

app.use("/", companyRouter);

app.get("/", (_req: Request, res: Response) => {
    console.log("ruta ok");
    res.send("ruta ok");
});

export default app;