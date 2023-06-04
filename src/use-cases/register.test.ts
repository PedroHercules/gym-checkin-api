import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(mockRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(mockRepository)

    const email = 'jhondoe@email.com'

    await registerUseCase.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    const createUserPromise = registerUseCase.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    expect(createUserPromise).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const mockRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(mockRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
