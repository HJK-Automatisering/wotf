import Company from './Company'
import { Team } from './School'
import VisitTime from './VisitTime'

export default interface Visit {
  id: string
  company: Company
  team: Team
  visitTime: VisitTime
}
