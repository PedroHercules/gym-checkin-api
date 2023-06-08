import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseProps {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  private gymsRepository: GymsRepository
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  public async execute({
    query,
    page,
  }: SearchGymsUseCaseProps): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
