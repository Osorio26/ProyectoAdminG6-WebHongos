import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import hongosRouter from "./routes/hongos.js";
import categoriesRouter from './routes/categories.js';
import { exportAllTablesToCSV } from './utils/csvExporter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/hongos", hongosRouter);
app.use('/categories', categoriesRouter);

export function startServer(port = PORT) {
    return app.listen(port, async () => {
        console.log(`Backend server running on http://localhost:${port}`);
        // Export CSVs on startup
        await exportAllTablesToCSV();
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}

