import { Dispatch, SetStateAction } from 'react'
import Company from '../types/Company'
import School from '../types/School'
import VisitTime from '../types/VisitTime'
import Visit from '../types/Visit'
import { v4 as uuidv4 } from 'uuid'
import Result, { Status } from '../types/Result'

class StateHandler {
  private companies: Company[]
  private setCompanies: Dispatch<SetStateAction<Company[]>>
  private schools: School[]
  private setSchools: Dispatch<SetStateAction<School[]>>
  private vistTimes: VisitTime[]
  private setVisitTime: Dispatch<SetStateAction<VisitTime[]>>
  private schedule: Visit[]
  private setSchedule: Dispatch<SetStateAction<Visit[]>>
  private shipTerms: string[]
  private setShipTerms: Dispatch<SetStateAction<string[]>>

  private okResult = { status: Status.Success, message: '' }

  constructor(
    companies: Company[],
    setCompanies: Dispatch<SetStateAction<Company[]>>,
    schools: School[],
    setSchools: Dispatch<SetStateAction<School[]>>,
    vistTimes: VisitTime[],
    setVisitTime: Dispatch<SetStateAction<VisitTime[]>>,
    schedule: Visit[],
    setSchedule: Dispatch<SetStateAction<Visit[]>>,
    shipTerms: string[],
    setShipTerms: Dispatch<SetStateAction<string[]>>
  ) {
    this.companies = companies
    this.setCompanies = setCompanies
    this.schools = schools
    this.setSchools = setSchools
    this.vistTimes = vistTimes
    this.setVisitTime = setVisitTime
    this.schedule = schedule
    this.setSchedule = setSchedule
    this.shipTerms = shipTerms
    this.setShipTerms = setShipTerms
  }

  getCompanies() {
    return [...this.companies]
  }

  getSchools() {
    return [...this.schools]
  }

  getVisitTimes() {
    return [...this.vistTimes]
  }

  addCompany(company: Company): Result {
    company.id = uuidv4()
    this.setCompanies([...this.companies, company])
    return this.okResult
  }

  addSchool(school: School): Result {
    school.id = uuidv4()

    if (school.numTeams > this.shipTerms.length) {
      return { status: Status.Error, message: 'Not enough ship terms, too many teams' }
    }

    const shipTerms = [...this.shipTerms]

    for (let i = 0; i < school.numTeams; i++) {
      school.teams.push({
        id: uuidv4(),
        schoolId: school.id,
        name: shipTerms.shift()!,
      })
    }

    this.setShipTerms(shipTerms)
    this.setSchools([...this.schools, school])
    return this.okResult
  }

  addVisitTime(visitTime: VisitTime): Result {
    visitTime.id = uuidv4()
    this.setVisitTime([...this.vistTimes, visitTime])
    return this.okResult
  }

  addVisit(visit: Visit): Result {
    if (this.schedule.some((v) => v.company.id === visit.company.id && v.visitTime.id === visit.visitTime.id)) {
      return { status: Status.Error, message: 'Company already has a visit at this time' }
    }

    if (this.schedule.some((v) => v.team.id === visit.team.id && v.visitTime.id === visit.visitTime.id)) {
      return { status: Status.Error, message: 'School already has a visit at this time' }
    }

    visit.id = uuidv4()
    this.setSchedule([...this.schedule, visit])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  removeCompany(companyId: string): Result {
    const company = this.companies.find((company) => company.id === companyId)

    if (!company) {
      return { status: Status.Error, message: 'Company not found' }
    }

    this.setCompanies(this.companies.filter((company) => company.id !== companyId))
    this.setSchedule(this.schedule.filter((visit) => visit.company.id !== companyId))
    return this.okResult
  }

  removeSchool(schoolId: string): Result {
    const school = this.schools.find((school) => school.id === schoolId)

    if (!school) {
      return { status: Status.Error, message: 'School not found' }
    }

    const teamNames = school.teams.map((team) => team.name).reverse()

    this.setShipTerms([...teamNames, ...this.shipTerms])
    this.setSchools(this.schools.filter((school) => school.id !== schoolId))
    this.setSchedule(this.schedule.filter((visit) => visit.team.schoolId !== schoolId))

    return this.okResult
  }

  removeVisitTime(visitTimeId: string): Result {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === visitTimeId)

    if (!visitTime) {
      return { status: Status.Error, message: 'Visit time not found' }
    }

    this.setVisitTime(this.vistTimes.filter((visitTime) => visitTime.id !== visitTimeId))
    this.setSchedule(this.schedule.filter((visit) => visit.visitTime.id !== visitTimeId))

    return this.okResult
  }

  removeVisit(visitId: string): Result {
    const visit = this.schedule.find((visit) => visit.id === visitId)

    if (!visit) {
      return { status: Status.Error, message: 'Visit not found' }
    }

    this.setSchedule(this.schedule.filter((visit) => visit.id !== visitId))

    return this.okResult
  }

  /////////////////////////////////////////////////////////

  removeAllCompanies(): Result {
    this.setCompanies([])
    this.setSchedule([])
    return this.okResult
  }

  removeAllSchools(): Result {
    this.setSchools([])
    this.setSchedule([])
    return this.okResult
  }

  removeAllVisitTimes(): Result {
    this.setVisitTime([])
    this.setSchedule([])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  updateCompany(updatedCompany: Company): Result {
    const company = this.companies.find((company) => company.id === updatedCompany.id)

    if (!company) {
      return { status: Status.Error, message: 'Company not found' }
    }

    this.setCompanies(this.companies.map((company) => (company.id === updatedCompany.id ? updatedCompany : company)))

    return this.okResult
  }

  updateSchool(updatedSchool: School): Result {
    const oldSchool = this.schools.find((school) => school.id === updatedSchool.id)

    if (!oldSchool) {
      return { status: Status.Error, message: 'School not found' }
    }

    const difference = updatedSchool.numTeams - oldSchool.numTeams

    if (difference > 0) {
      if (difference > this.shipTerms.length) {
        return { status: Status.Error, message: 'Not enough ship terms, too many teams' }
      }

      const shipTerms = [...this.shipTerms]

      for (let i = 0; i < difference; i++) {
        updatedSchool.teams.push({
          id: uuidv4(),
          schoolId: updatedSchool.id,
          name: this.shipTerms.shift()!,
        })
      }

      this.setShipTerms(shipTerms)
    } else if (difference < 0) {
      const removedTeams = oldSchool.teams.slice(updatedSchool.numTeams)
      const teamNames = removedTeams.map((team) => team.name).reverse()

      updatedSchool.teams = oldSchool.teams.slice(0, updatedSchool.numTeams)
      this.setShipTerms([...teamNames, ...this.shipTerms])
    }

    this.setSchools(this.schools.map((school) => (school.id === updatedSchool.id ? updatedSchool : school)))
    return this.okResult
  }

  updateVisitTime(updatedVisitTime: VisitTime): Result {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === updatedVisitTime.id)

    if (!visitTime) {
      return { status: Status.Error, message: 'Visit time not found' }
    }

    this.setVisitTime(
      this.vistTimes.map((visitTime) => (visitTime.id === updatedVisitTime.id ? updatedVisitTime : visitTime))
    )

    return this.okResult
  }
}

export default StateHandler
