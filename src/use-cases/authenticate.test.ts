import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentiaslError } from './errors/invalid-credentials'

const userData = {
  name: 'Jhon Doe',
  email: 'jhondoe@email.com',
  password: '1234567',
}

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(mockRepository)

    await mockRepository.create({
      name: userData.name,
      email: userData.email,
      password_hash: await hash(userData.password, 6),
    })

    const { user } = await sut.execute({
      email: userData.email,
      password: userData.password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(mockRepository)

    const authenticateUserPromise = sut.execute({
      email: 'pedro@email.com',
      password: userData.password,
    })

    await expect(authenticateUserPromise).rejects.toBeInstanceOf(
      InvalidCredentiaslError,
    )
  })

  it('should not be able to authenticate with wrong password', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(mockRepository)

    await mockRepository.create({
      name: userData.name,
      email: userData.email,
      password_hash: await hash(userData.password, 6),
    })

    const authenticateUserPromise = sut.execute({
      email: userData.email,
      password: '654321',
    })

    await expect(authenticateUserPromise).rejects.toBeInstanceOf(
      InvalidCredentiaslError,
    )
  })
})
