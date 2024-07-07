export enum Status {
  Success = 0,
  Error = 1,
}

export default interface Result<T> {
  status: Status
  message: string
  data: T
}
