import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  private checkInsRepository: CheckInsRepository
  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validate_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
