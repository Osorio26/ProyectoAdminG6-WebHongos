import { CreateColectaDto } from "../dto/CreateColectaDto";
import { UpdateColectaDto } from "../dto/UpdateColectaDto";

export interface IColectaRepository {
  create(data: CreateColectaDto);
  getById(id: string);
  getAll();
  update(id: string, data: UpdateColectaDto);
  delete(id: string);
}
