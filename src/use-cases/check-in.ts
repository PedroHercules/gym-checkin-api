import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLongitude: number
  userLatitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  private checkInsRepository: CheckInsRepository
  private gymsRepository: GymsRepository
  constructor(
    checkInsRespository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInsRepository = checkInsRespository
    this.gymsRepository = gymsRepository
  }

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculate distance between user and gym

    const checkInOnSameDate = await this.checkInsRepository.findUserIdByDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
