import { expect, describe, it } from 'vitest'
import { beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JS Gym',
      description: null,
      phone: null,
      latitude: 40.69754,
      longitude: -74.3093378,
    })

    await gymsRepository.create({
      title: 'JS Academia',
      description: null,
      phone: null,
      latitude: 40.69754,
      longitude: -74.3093378,
    })

    await gymsRepository.create({
      title: 'Python',
      description: null,
      phone: null,
      latitude: 40.69754,
      longitude: -74.3093378,
    })

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym' }),
      expect.objectContaining({ title: 'JS Academia' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JS Gym ${i}`,
        description: null,
        phone: null,
        latitude: 40.69754,
        longitude: -74.3093378,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JS Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym 21' }),
      expect.objectContaining({ title: 'JS Gym 22' }),
    ])
  })
})
