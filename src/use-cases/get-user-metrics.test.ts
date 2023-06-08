import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

/**
 * Fases do TDD
 * Red: Escrever um teste que falhe
 * Green: Codificar o mínimo possível para o teste passar
 * Refactor: Refatorar o código escrito
 */

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInsRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user_01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
