import express from "express";
import cors from "cors";
import hongosRouter from "./routes/hongos.js";
import categoriesRouter from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/hongos", hongosRouter);
app.use('/categories', categoriesRouter);

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});

