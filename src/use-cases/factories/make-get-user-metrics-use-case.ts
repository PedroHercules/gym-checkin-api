import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

// Factory pattern

export function makeGetUserMetricsUseCase() {
  const usersRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(usersRepository)

  return useCase
}
