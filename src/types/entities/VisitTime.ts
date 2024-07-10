import BaseEntity from './BaseEntity'
import { v4 as uuidv4 } from 'uuid'
import Result, { Status } from '../Result'
import VisitTimeFormData from '../entityFormData/VisitTimeFormData'

export interface SerializedVisitTime {
  id: string
  displayName: string
  startTime: string
  endTime: string
}

export default class VisitTime implements BaseEntity<VisitTimeFormData> {
  id: string
  displayName: string
  startTime: Date
  endTime: Date

  constructor(startTime: Date, endTime: Date) {
    this.id = uuidv4()
    this.startTime = startTime
    this.endTime = endTime
    this.displayName = VisitTime.getDisplayName(startTime, endTime)
  }

  private static getDisplayName(startTime: Date, endTime: Date): string {
    return `${startTime.getHours().toString().padStart(2, '0')}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  private static getDateTimeFromTimeString(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map((time) => parseInt(time))

    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
  }

  private static getTimeStringFromDateTime(dateTime: Date): string {
    return dateTime.toTimeString().slice(0, 5)
  }

  static fromFormData(formData: VisitTimeFormData): VisitTime {
    return new VisitTime(
      VisitTime.getDateTimeFromTimeString(formData.startTime),
      VisitTime.getDateTimeFromTimeString(formData.endTime)
    )
  }

  static fromSerializedData(data: SerializedVisitTime): VisitTime {
    const { id, displayName, startTime, endTime } = data
    const visitTime = new VisitTime(new Date(startTime), new Date(endTime))
    visitTime.id = id
    visitTime.displayName = displayName
    return visitTime
  }

  updateFromFormData(formData: VisitTimeFormData): Result<null> {
    this.startTime = VisitTime.getDateTimeFromTimeString(formData.startTime)
    this.endTime = VisitTime.getDateTimeFromTimeString(formData.endTime)
    this.displayName = VisitTime.getDisplayName(this.startTime, this.endTime)
    return { status: Status.Success, message: '', data: null }
  }

  toFormData(): VisitTimeFormData {
    return {
      startTime: VisitTime.getTimeStringFromDateTime(this.startTime),
      endTime: VisitTime.getTimeStringFromDateTime(this.endTime),
    }
  }
}
