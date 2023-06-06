import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUSeCaseProps {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUSeCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  private gymsRepository: GymsRepository
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  public async execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  }: CreateGymUSeCaseProps): Promise<CreateGymUSeCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone,
    })

    return {
      gym,
    }
  }
}
