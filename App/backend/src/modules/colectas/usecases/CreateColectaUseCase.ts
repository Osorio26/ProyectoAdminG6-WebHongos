import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/types";
import { IColectaRepository } from "../repository/IColectaRepository";

@injectable()
export class CreateColectaUseCase {
  constructor(
    @inject(TYPES.ColectaRepository)
    private repo: IColectaRepository
  ) {}

  execute(data) {
    return this.repo.create(data);
  }
}
