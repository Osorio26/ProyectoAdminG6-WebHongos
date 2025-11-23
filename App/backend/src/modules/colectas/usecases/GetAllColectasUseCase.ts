@injectable()
export class GetAllColectasUseCase {
  constructor(
    @inject(TYPES.ColectaRepository)
    private repo: IColectaRepository
  ) {}

  execute() {
    return this.repo.getAll();
  }
}
