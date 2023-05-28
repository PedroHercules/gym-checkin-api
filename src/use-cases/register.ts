import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: any
  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }

  public async execute({ email, name, password }: RegisterUseCaseProps) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

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
