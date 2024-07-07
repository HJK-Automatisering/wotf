import Company from '../types/Company'
import Result, { Status } from '../types/Result'

export default class ImportHandler {
  constructor() {}

  static async getCompaniesFromClipboard(): Promise<Result<Company[]>> {
    try {
      const clipboardText = await navigator.clipboard.readText()

      const companyStrings = clipboardText.split('\n')
      const companies = companyStrings.map((companyString) => {
        const company = companyString.split('\t')
        return {
          id: '',
          name: company[0],
          contactPerson: company[1],
          phone: company[2],
          email: company[3],
          adress: company[4],
          website: company[5],
        }
      })
      return { status: Status.Success, message: '', data: companies }
    } catch (error) {
      return { status: Status.Error, message: 'Kunne ikke læse fra udklipsholder', data: [] }
    }
  }
}
