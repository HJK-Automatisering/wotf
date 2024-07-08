import Company, { SerializedCompany } from '../types/Company'
import School, { SerializedSchool } from '../types/School'
import Visit, { SerializedVisit } from '../types/Visit'
import VisitTime, { SerializedVisitTime } from '../types/VisitTime'

interface GlobalState {
  companies: Company[]
  schools: School[]
  visitTimes: VisitTime[]
  schedule: Visit[]
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
      const scheduleJson = savedStateJson.schedule

      const companies = companiesJson.map((data: SerializedCompany) => Company.fromSerializedData(data))
      const schools = schoolsJson.map((data: SerializedSchool) => School.fromSerializedData(data))
      const visitTimes = visitTimesJson.map((data: SerializedVisitTime) => VisitTime.fromSerializedData(data))
      const schedule = scheduleJson.map((data: SerializedVisit) => Visit.fromSerializedData(data))

      return {
        companies,
        schools,
        visitTimes,
        schedule,
      }
    } else {
      return {
        companies: [],
        schools: [],
        visitTimes: [],
        schedule: [],
      }
    }
  }

  clearState() {
    localStorage.removeItem(this.storedStateName)
    location.reload()
  }
}

export default SaveStateHandler
