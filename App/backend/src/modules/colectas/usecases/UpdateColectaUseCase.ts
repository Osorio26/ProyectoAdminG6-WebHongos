@injectable()
export class UpdateColectaUseCase {
  constructor(
    @inject(TYPES.ColectaRepository)
    private repo: IColectaRepository
  ) {}

  execute(id: string, data) {
    return this.repo.update(id, data);
  }
}
