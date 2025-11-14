import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/hongos.json");

router.get("/", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);
		res.json(data);
	} catch (err) {
		console.error("Error reading hongos.json", err);
		res.status(500).json({ message: "Error reading data" });
	}
});

router.get("/:code", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);
		const fungus = data.find((item) => item.code === req.params.code);
		if (!fungus) {
			return res.status(404).json({ message: "Fungus not found" });
		}
		res.json(fungus);
	} catch (err) {
		console.error("Error reading hongos.json", err);
		res.status(500).json({ message: "Error reading data" });
	}
});

export default router;

