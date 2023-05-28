import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: UsersRepository
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  public async execute({ email, name, password }: RegisterUseCaseProps) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('Already exists a user with same e-mail!')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
