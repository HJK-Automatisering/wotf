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

  private okResult: Result<null> = { status: Status.Success, message: '', data: null }

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

  addCompany(company: Company): Result<null> {
    company.id = uuidv4()
    this.setCompanies((companies) => [...companies, company])
    return this.okResult
  }

  addSchool(school: School): Result<null> {
    school.id = uuidv4()

    if (school.numTeams > this.shipTerms.length) {
      return { status: Status.Error, message: 'For mange hold, er løbet tør for gruppenavne!', data: null }
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
    this.setSchools((schools) => [...schools, school])
    return this.okResult
  }

  addVisitTime(visitTime: VisitTime): Result<null> {
    visitTime.id = uuidv4()
    this.setVisitTime([...this.vistTimes, visitTime])
    return this.okResult
  }

  addVisit(visit: Visit): Result<null> {
    if (this.schedule.some((v) => v.company.id === visit.company.id && v.visitTime.id === visit.visitTime.id)) {
      return { status: Status.Error, message: 'Virksomheden har allerede et besøg på dette tidspunkt', data: null }
    }

    if (this.schedule.some((v) => v.team.id === visit.team.id && v.visitTime.id === visit.visitTime.id)) {
      return { status: Status.Error, message: 'Holdet har allerede et besøg på dette tidspunkt', data: null }
    }

    visit.id = uuidv4()
    this.setSchedule([...this.schedule, visit])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  addCompanies(companies: Company[]): Result<null> {
    const curSchools = [...this.companies]
    const results = companies.map((company) => this.addCompany(company))

    const error = results.find((result) => result.status === Status.Error)
    if (error) {
      this.setCompanies(curSchools)
      return { status: Status.Error, message: error.message, data: null }
    }

    return this.okResult
  }

  addSchhols(schools: School[]): Result<null> {
    const curSchools = [...this.schools]
    const results = schools.map((school) => this.addSchool(school))

    const error = results.find((result) => result.status === Status.Error)
    if (error) {
      this.setSchools(curSchools)
      return { status: Status.Error, message: error.message, data: null }
    }

    return this.okResult
  }

  /////////////////////////////////////////////////////////

  removeCompany(companyId: string): Result<null> {
    const company = this.companies.find((company) => company.id === companyId)

    if (!company) {
      return { status: Status.Error, message: 'Virksomhed ikke fundet', data: null }
    }

    this.setCompanies(this.companies.filter((company) => company.id !== companyId))
    this.setSchedule(this.schedule.filter((visit) => visit.company.id !== companyId))
    return this.okResult
  }

  removeSchool(schoolId: string): Result<null> {
    const school = this.schools.find((school) => school.id === schoolId)

    if (!school) {
      return { status: Status.Error, message: 'Skole ikke fundet', data: null }
    }

    const teamNames = school.teams.map((team) => team.name).reverse()

    this.setShipTerms([...teamNames, ...this.shipTerms])
    this.setSchools(this.schools.filter((school) => school.id !== schoolId))
    this.setSchedule(this.schedule.filter((visit) => visit.team.schoolId !== schoolId))

    return this.okResult
  }

  removeVisitTime(visitTimeId: string): Result<null> {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === visitTimeId)

    if (!visitTime) {
      return { status: Status.Error, message: 'Besøgstidspunkt ikke fundet', data: null }
    }

    this.setVisitTime(this.vistTimes.filter((visitTime) => visitTime.id !== visitTimeId))
    this.setSchedule(this.schedule.filter((visit) => visit.visitTime.id !== visitTimeId))

    return this.okResult
  }

  removeVisit(visitId: string): Result<null> {
    const visit = this.schedule.find((visit) => visit.id === visitId)

    if (!visit) {
      return { status: Status.Error, message: 'Besøg ikke fundet', data: null }
    }

    this.setSchedule(this.schedule.filter((visit) => visit.id !== visitId))

    return this.okResult
  }

  /////////////////////////////////////////////////////////

  removeAllCompanies(): Result<null> {
    this.setCompanies([])
    this.setSchedule([])
    return this.okResult
  }

  removeAllSchools(): Result<null> {
    this.setSchools([])
    this.setSchedule([])
    return this.okResult
  }

  removeAllVisitTimes(): Result<null> {
    this.setVisitTime([])
    this.setSchedule([])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  updateCompany(updatedCompany: Company): Result<null> {
    const company = this.companies.find((company) => company.id === updatedCompany.id)

    if (!company) {
      return { status: Status.Error, message: 'Virksomhed ikke fundet', data: null }
    }

    this.setCompanies(this.companies.map((company) => (company.id === updatedCompany.id ? updatedCompany : company)))

    return this.okResult
  }

  updateSchool(updatedSchool: School): Result<null> {
    const oldSchool = this.schools.find((school) => school.id === updatedSchool.id)

    if (!oldSchool) {
      return { status: Status.Error, message: 'Skole ikke fundet', data: null }
    }

    const difference = updatedSchool.numTeams - oldSchool.numTeams

    if (difference > 0) {
      if (difference > this.shipTerms.length) {
        return { status: Status.Error, message: 'For mange hold, er løbet tør for gruppenavne!', data: null }
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

  updateVisitTime(updatedVisitTime: VisitTime): Result<null> {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === updatedVisitTime.id)

    if (!visitTime) {
      return { status: Status.Error, message: 'Besøgstidspunkt ikke fundet', data: null }
    }

    this.setVisitTime(
      this.vistTimes.map((visitTime) => (visitTime.id === updatedVisitTime.id ? updatedVisitTime : visitTime))
    )

    return this.okResult
  }
}

export default StateHandler
