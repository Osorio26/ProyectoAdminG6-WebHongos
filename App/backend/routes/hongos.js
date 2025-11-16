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

router.post("/", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);

		const newFungus = req.body;
		if (!newFungus || !newFungus.code) {
			return res.status(400).json({ message: "'code' is required" });
		}

		const exists = data.some((item) => item.code === newFungus.code);
		if (exists) {
			return res.status(409).json({ message: "Fungus with this code already exists" });
		}

		data.push(newFungus);
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

		res.status(201).json(newFungus);
	} catch (err) {
		console.error("Error writing hongos.json", err);
		res.status(500).json({ message: "Error saving data" });
	}
});

router.put("/:code", (req, res) => {
	try {
		const raw = fs.readFileSync(dataPath, "utf-8");
		const data = JSON.parse(raw);
		const index = data.findIndex((item) => item.code === req.params.code);

		if (index === -1) {
			return res.status(404).json({ message: "Fungus not found" });
		}

		const updated = { ...data[index], ...req.body, code: data[index].code };
		data[index] = updated;
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

		res.json(updated);
	} catch (err) {
		console.error("Error updating hongos.json", err);
		res.status(500).json({ message: "Error updating data" });
	}
});

export default router;

