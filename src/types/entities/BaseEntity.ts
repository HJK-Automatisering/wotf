import BaseFormData from '../entityFormData/BaseFormData'

export default interface BaseEntity<T extends BaseFormData> {
  id: string
  displayName: string
  toFormData: () => T
}
