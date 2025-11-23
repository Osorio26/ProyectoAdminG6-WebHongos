import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { IColectaRepository } from "./IColectaRepository";

@injectable()
export class PrismaColectaRepository implements IColectaRepository {
  private prisma = new PrismaClient();

  create(data) {
    return this.prisma.colectas.create({ data });
  }

  getById(id: string) {
    return this.prisma.colectas.findUnique({ where: { id } });
  }

  getAll() {
    return this.prisma.colectas.findMany();
  }

  update(id: string, data) {
    return this.prisma.colectas.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.colectas.delete({ where: { id } });
  }
}
