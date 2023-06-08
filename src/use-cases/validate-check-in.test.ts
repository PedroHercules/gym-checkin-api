import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation'

/**
 * Fases do TDD
 * Red: Escrever um teste que falhe
 * Green: Codificar o mínimo possível para o teste passar
 * Refactor: Refatorar o código escrito
 */

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validate_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validate_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent the check-in', async () => {
    const validateCheckInPromise = sut.execute({
      checkInId: 'inexistent-check-in-id',
    })

    await expect(validateCheckInPromise).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 15, 40)) // UTC

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const minutesInMs = 1000 * 60 * 21 // 21 minutes

    vi.advanceTimersByTime(minutesInMs)

    const validateCheckInPromise = sut.execute({
      checkInId: createdCheckIn.id,
    })

    await expect(validateCheckInPromise).rejects.toBeInstanceOf(
      LateCheckInValidationError,
    )
  })
})
