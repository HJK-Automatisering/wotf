import Company, { SerializedCompany } from '../types/entities/Company'
import School, { SerializedSchool } from '../types/entities/School'
import Visit, { SerializedVisit } from '../types/Visit'
import VisitTime, { SerializedVisitTime } from '../types/entities/VisitTime'

interface GlobalState {
  companies: Company[]
  schools: School[]
  visitTimes: VisitTime[]
  visits: Visit[]
}

class SaveStateHandler {
  private storedStateName = 'wotfState'

  saveState(globalState: GlobalState) {
    const stateString = JSON.stringify(globalState)
    localStorage.setItem(this.storedStateName, stateString)
  }

  loadState(): GlobalState {
    const savedStateString = localStorage.getItem(this.storedStateName)

    if (savedStateString) {
      const savedStateJson = JSON.parse(savedStateString)
      const companiesJson = savedStateJson.companies
      const schoolsJson = savedStateJson.schools
      const visitTimesJson = savedStateJson.visitTimes
      const visitsJson = savedStateJson.visits

      const companies = companiesJson.map((data: SerializedCompany) => Company.fromSerializedData(data))
      const schools = schoolsJson.map((data: SerializedSchool) => School.fromSerializedData(data))
      const visitTimes = visitTimesJson.map((data: SerializedVisitTime) => VisitTime.fromSerializedData(data))
      const visits = visitsJson.map((data: SerializedVisit) => Visit.fromSerializedData(data))

      return {
        companies,
        schools,
        visitTimes,
        visits: visits,
      }
    } else {
      return {
        companies: [],
        schools: [],
        visitTimes: [],
        visits: [],
      }
    }
  }

  clearState() {
    localStorage.removeItem(this.storedStateName)
    location.reload()
  }
}

export default SaveStateHandler
