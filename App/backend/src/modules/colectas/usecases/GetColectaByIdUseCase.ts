@injectable()
export class GetColectaByIdUseCase {
  constructor(
    @inject(TYPES.ColectaRepository)
    private repo: IColectaRepository
  ) {}

  execute(id: string) {
    return this.repo.getById(id);
  }
}
