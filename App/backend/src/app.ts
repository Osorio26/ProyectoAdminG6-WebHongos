import express from "express";
import colectaRoutes from "./modules/colectas/routes/colecta.routes";

const app = express();
app.use(express.json());

app.use("/api/colectas", colectaRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));