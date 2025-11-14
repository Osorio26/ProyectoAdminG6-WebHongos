import express from "express";
import cors from "cors";
import hongosRouter from "./routes/hongos.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/hongos", hongosRouter);

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});

