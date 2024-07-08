import Company, { SerializedCompany } from './Company'
import School, { SerializedTeam, Team } from './School'
import VisitTime, { SerializedVisitTime } from './VisitTime'

export interface SerializedVisit {
  id: string
  company: SerializedCompany
  team: SerializedTeam
  visitTime: SerializedVisitTime
}

export default class Visit {
  id: string
  company: Company
  team: Team
  visitTime: VisitTime

  constructor(company: Company, team: Team, visitTime: VisitTime) {
    this.id = company.id
    this.company = company
    this.team = team
    this.visitTime = visitTime
  }

  static fromSerializedData(data: SerializedVisit): Visit {
    const { company, team, visitTime } = data
    return new Visit(
      Company.fromSerializedData(company),
      School.fromSerializedTeamData(team),
      VisitTime.fromSerializedData(visitTime)
    )
  }
}
