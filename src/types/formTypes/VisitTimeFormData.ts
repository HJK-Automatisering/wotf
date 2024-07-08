import BaseFormData from '../BaseFormData'

export default interface VisitTimeFormData extends BaseFormData {
  startTime: string
  endTime: string
}
