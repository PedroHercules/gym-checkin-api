import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

/**
 * Fases do TDD
 * Red: Escrever um teste que falhe
 * Green: Codificar o mínimo possível para o teste passar
 * Refactor: Refatorar o código escrito
 */

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS gym',
      description: 'blabla',
      phone: '89089090908',
      latidude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.69754,
      userLongitude: -74.3093378,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // Ensures the creation date will be the same
    vi.setSystemTime(new Date(2023, 5, 4, 18, 44, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.69754,
      userLongitude: -74.3093378,
    })

    const checkInPromise = sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.69754,
      userLongitude: -74.3093378,
    })

    await expect(checkInPromise).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    // Ensures the creation date will be the same
    vi.setSystemTime(new Date(2023, 5, 4, 18, 44, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.69754,
      userLongitude: -74.3093378,
    })

    vi.setSystemTime(new Date(2023, 5, 5, 18, 44, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.69754,
      userLongitude: -74.3093378,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
