import Company from '../types/Company'
import School from '../types/School'
import Visit from '../types/Visit'
import VisitTime from '../types/VisitTime'

interface GlobalState {
  companies: Company[]
  schools: School[]
  visitTimes: VisitTime[]
  schedule: Visit[]
  shipTerms: string[]
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
      return JSON.parse(savedStateString)
    } else {
      return {
        companies: [],
        schools: [],
        visitTimes: [],
        schedule: [],
        shipTerms: [],
      }
    }
  }

  clearState() {
    localStorage.removeItem(this.storedStateName)
    location.reload()
  }
}

export default SaveStateHandler
