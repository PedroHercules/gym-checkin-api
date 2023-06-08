import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUserHistoryUseCase } from '../check-in-user-history'

// Factory pattern

export function makeCheckInUserHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new CheckInUserHistoryUseCase(checkInsRepository)

  return useCase
}
