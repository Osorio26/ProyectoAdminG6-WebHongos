import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/types";

@injectable()
export class ColectaController {
  constructor(
    @inject(TYPES.CreateColectaUseCase) private createUC,
    @inject(TYPES.GetColectaByIdUseCase) private getByIdUC,
    @inject(TYPES.GetAllColectasUseCase) private getAllUC,
    @inject(TYPES.UpdateColectaUseCase) private updateUC,
    @inject(TYPES.DeleteColectaUseCase) private deleteUC
  ) {}

  create = async (req, res) => {
    const result = await this.createUC.execute(req.body);
    res.json(result);
  };

  getAll = async (_, res) => {
    const result = await this.getAllUC.execute();
    res.json(result);
  };

  getById = async (req, res) => {
    const result = await this.getByIdUC.execute(req.params.id);
    res.json(result);
  };

  update = async (req, res) => {
    const result = await this.updateUC.execute(req.params.id, req.body);
    res.json(result);
  };

  delete = async (req, res) => {
    await this.deleteUC.execute(req.params.id);
    res.json({ message: "Colecta eliminada" });
  };
}