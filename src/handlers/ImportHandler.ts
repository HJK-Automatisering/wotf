import CompanyFormData from '../types/formTypes/CompanyFormData'
import SchoolFormData from '../types/formTypes/SchoolFormData'
import VisitTimeFormData from '../types/formTypes/VisitTimeFormData'
import Result, { Status } from '../types/Result'

export default class ImportHandler {
  constructor() {}

  static async getCompaniesFromClipboard(): Promise<Result<CompanyFormData[]>> {
    try {
      const clipboardText = await navigator.clipboard.readText()

      const companyStrings = clipboardText.split('\n')
      const companies = companyStrings.map((companyString) => {
        const companyData = companyString.split('\t')
        return {
          name: companyData[0],
          contactPerson: companyData[1],
          phone: companyData[2],
          email: companyData[3],
          address: companyData[4],
          website: companyData[5],
        }
      })
      return { status: Status.Success, message: '', data: companies }
    } catch (error) {
      return { status: Status.Error, message: 'Kunne ikke læse fra udklipsholder', data: [] }
    }
  }

  static async getSchoolsFromClipboard(): Promise<Result<SchoolFormData[]>> {
    try {
      const clipboardText = await navigator.clipboard.readText()

      const schoolStrings = clipboardText.split('\n')
      const schools = schoolStrings.map((schoolString) => {
        const schoolData = schoolString.split('\t')
        return {
          name: schoolData[0],
          numTeams: schoolData[1],
        }
      })
      return { status: Status.Success, message: '', data: schools }
    } catch (error) {
      return { status: Status.Error, message: 'Kunne ikke læse fra udklipsholder', data: [] }
    }
  }

  static async getVisitTimesFromClipboard(): Promise<Result<VisitTimeFormData[]>> {
    try {
      const clipboardText = await navigator.clipboard.readText()

      const visitTimeStrings = clipboardText.split('\n')
      const visitTimes = visitTimeStrings.map((visitTimeString) => {
        const visitTimeData = visitTimeString.split('\t')
        return {
          startTime: visitTimeData[0],
          endTime: visitTimeData[1],
        }
      })
      return { status: Status.Success, message: '', data: visitTimes }
    } catch (error) {
      return { status: Status.Error, message: 'Kunne ikke læse fra udklipsholder', data: [] }
    }
  }
}
