import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseProps {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  email,
  name,
  password,
}: RegisterUseCaseProps) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Already exists a user with same e-mail!')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
