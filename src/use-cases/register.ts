import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { User } from '@prisma/client'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  private usersRepository: UsersRepository
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  public async execute({
    email,
    name,
    password,
  }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
