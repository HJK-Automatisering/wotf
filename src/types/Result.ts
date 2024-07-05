export enum Status {
  Success = 0,
  Error = 1,
}

export default interface Result {
  status: Status
  message: string
}
