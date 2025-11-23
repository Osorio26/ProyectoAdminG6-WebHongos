import { Router } from "express";
import { container } from "../../../config/inversify.config";
import { TYPES } from "../../../config/types";
import { ColectaController } from "../controller/ColectaController";

const router = Router();
const controller = container.get<ColectaController>(TYPES.ColectaController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);

export default router;