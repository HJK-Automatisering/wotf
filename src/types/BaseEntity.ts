import BaseFormData from './BaseFormData'

export default interface BaseEntity<T extends BaseFormData> {
  id: string
  displayName: string
  toFormData: () => T
}
