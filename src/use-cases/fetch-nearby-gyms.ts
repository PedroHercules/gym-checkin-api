import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsUseCaseProps {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  private gymsRepository: GymsRepository
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  public async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseProps): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
