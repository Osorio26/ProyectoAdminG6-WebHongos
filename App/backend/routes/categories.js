import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/categories.json");

router.get("/", (req, res) => {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        const data = JSON.parse(raw);
        res.json(data);
    } catch (err) {
        console.error("Error reading categories.json.", err);
        try { process.stdout.write("[categories.js] Error reading categories.json: " + String(err) + "\n"); } catch(e) {}
        res.status(500).json({ message: "Error reading data!" });
    }
});

router.get("/:title", (req, res) => {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        const data = JSON.parse(raw);
        const titleParam = decodeURIComponent(req.params.title).toLowerCase();
        const category = data.find((item) => item.title && item.title.toLowerCase() === titleParam);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        console.error("Error reading categories.json", err);
        try { process.stdout.write("[categories.js] Error reading categories.json: " + String(err) + "\n"); } catch(e) {}
        res.status(500).json({ message: "Error reading data" });
    }
});

router.post("/", (req, res) => {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        const data = JSON.parse(raw);

        const newCategory = req.body;
        if (!newCategory || !newCategory.title) {
            return res.status(400).json({ message: "'title' is required" });
        }

        const exists = data.some((item) => item.title && item.title.toLowerCase() === newCategory.title.toLowerCase());
        if (exists) {
            return res.status(409).json({ message: "A category with this title already exists" });
        }

        data.push(newCategory);
        try {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
        } catch (writeErr) {
            console.error("Error writing to categories.json file:", writeErr);
            try { process.stdout.write("[categories.js] Error writing to categories.json: " + String(writeErr) + "\n"); } catch(e) {}
            try { process.stdout.write("[categories.js] Data attempted to write: " + JSON.stringify(data, null, 2) + "\n"); } catch(e) {}
            return res.status(500).json({ message: "Error saving data! (write failure)" });
        }
        console.log(`✓ POST: Category "${newCategory.title}" created. Total in file: ${data.length}`);

        res.status(201).json(newCategory);
    } catch (err) {
        console.error("Error in POST /categories:", err);
        try { process.stdout.write("[categories.js] Error in POST /categories: " + String(err) + "\n"); } catch(e) {}
        try { process.stdout.write("[categories.js] Request body: " + JSON.stringify(req.body) + "\n"); } catch(e) {}
        res.status(500).json({ message: "Error saving data! (read/parse failure)" });
    }
});

router.put("/:title", (req, res) => {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        const data = JSON.parse(raw);
        const titleParam = decodeURIComponent(req.params.title).toLowerCase();
        const index = data.findIndex((item) => item.title && item.title.toLowerCase() === titleParam);

        if (index === -1) {
            return res.status(404).json({ message: "Category not found" });
        }

        const updated = { ...data[index], ...req.body };
        data[index] = updated;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
        console.log(`✓ PUT: Category "${updated.title}" updated`);

        res.json(updated);
    } catch (err) {
        console.error("Error updating categories.json", err);
        try { process.stdout.write("[categories.js] Error updating categories.json: " + String(err) + "\n"); } catch(e) {}
        res.status(500).json({ message: "Error updating data!" });
    }
});

export default router;

