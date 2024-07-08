import BaseFormData from '../BaseFormData'

export default interface CompanyFormData extends BaseFormData {
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  website: string
}
