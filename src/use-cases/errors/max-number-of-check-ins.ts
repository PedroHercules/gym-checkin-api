export class MaxNumberOfCheckInslError extends Error {
  constructor() {
    super('Max number of check-ins reached.')
  }
}
