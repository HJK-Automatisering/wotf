import BaseEntity from './BaseEntity'
import { v4 as uuidv4 } from 'uuid'
import CompanyFormData from '../entityFormData/CompanyFormData'
import Result, { Status } from '../Result'

export interface SerializedCompany {
  id: string
  displayName: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  website: string
}

export default class Company implements BaseEntity<CompanyFormData> {
  id: string
  displayName: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  website: string

  constructor(name: string, contactPerson: string, phone: string, email: string, address: string, website: string) {
    this.id = uuidv4()
    this.displayName = name
    this.name = name
    this.contactPerson = contactPerson
    this.phone = phone
    this.email = email
    this.address = address
    this.website = website
  }

  static fromFormData(formData: CompanyFormData): Company {
    return new Company(
      formData.name,
      formData.contactPerson,
      formData.phone,
      formData.email,
      formData.address,
      formData.website
    )
  }

  static fromSerializedData(data: SerializedCompany): Company {
    const { id, displayName, name, contactPerson, phone, email, address, website } = data
    const company = new Company(name, contactPerson, phone, email, address, website)
    company.id = id
    company.displayName = displayName

    return company
  }

  updateFromFormData(formData: CompanyFormData): Result<null> {
    this.displayName = formData.name
    this.name = formData.name
    this.contactPerson = formData.contactPerson
    this.phone = formData.phone
    this.email = formData.email
    this.address = formData.address
    this.website = formData.website

    return { status: Status.Success, message: '', data: null }
  }

  toFormData(): CompanyFormData {
    return {
      name: this.name,
      contactPerson: this.contactPerson,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
    }
  }
}
