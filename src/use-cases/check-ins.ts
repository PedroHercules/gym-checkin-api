import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from '@/utils/get-distance-between-coordinates'
import { MaxNumberOfCheckInslError } from './errors/max-number-of-check-ins'
import { MaxDistanceError } from './errors/max-distance'

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
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const userCoordinates: Coordinate = {
      latitude: userLatitude,
      longitude: userLongitude,
    }

    const gymCoordinates: Coordinate = {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }
    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
      userCoordinates,
      gymCoordinates,
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 0.1 Km == 100 meters

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findUserIdByDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInslError()
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
