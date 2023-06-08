import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async findUserIdByDate(userId: string, date: Date) {
    // Get the start of the day. Ex: 2023-06-04T00:00:00
    const startOfTheDay = dayjs(date).startOf('date')

    // Get the end of the day. Ex: 2023-06-04T23:59:59
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    const userCheckIns = this.checkIns
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return userCheckIns
  }

  async countByUserId(userId: string) {
    const userCheckIns = this.checkIns.filter((item) => item.user_id === userId)

    return userCheckIns.length
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn
    }

    return checkIn
  }
}
