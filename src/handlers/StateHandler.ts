import { Dispatch, SetStateAction } from 'react'
import Company from '../types/entities/Company'
import School from '../types/entities/School'
import VisitTime from '../types/entities/VisitTime'
import Visit from '../types/Visit'
import { v4 as uuidv4 } from 'uuid'
import Result, { Status } from '../types/Result'
import CompanyFormData from '../types/entityFormData/CompanyFormData'
import SchoolFormData from '../types/entityFormData/SchoolFormData'
import shipTerms from '../data/shipTerms'
import VisitTimeFormData from '../types/entityFormData/VisitTimeFormData'

class StateHandler {
  private companies: Company[]
  private setCompanies: Dispatch<SetStateAction<Company[]>>
  private schools: School[]
  private setSchools: Dispatch<SetStateAction<School[]>>
  private vistTimes: VisitTime[]
  private setVisitTime: Dispatch<SetStateAction<VisitTime[]>>
  private visits: Visit[]
  private setVisits: Dispatch<SetStateAction<Visit[]>>

  private shipTerms = [...shipTerms]
  private okResult: Result<null> = { status: Status.Success, message: '', data: null }

  constructor(
    companies: Company[],
    setCompanies: Dispatch<SetStateAction<Company[]>>,
    schools: School[],
    setSchools: Dispatch<SetStateAction<School[]>>,
    vistTimes: VisitTime[],
    setVisitTime: Dispatch<SetStateAction<VisitTime[]>>,
    visits: Visit[],
    setVisits: Dispatch<SetStateAction<Visit[]>>
  ) {
    this.companies = companies
    this.setCompanies = setCompanies
    this.schools = schools
    this.setSchools = setSchools
    this.vistTimes = vistTimes
    this.setVisitTime = setVisitTime
    this.visits = visits
    this.setVisits = setVisits
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

  getVisits() {
    return [...this.visits]
  }

  addCompany(companyData: CompanyFormData): Result<null> {
    const company = Company.fromFormData(companyData)
    this.setCompanies((companies) => [...companies, company])
    return this.okResult
  }

  addSchool(schoolData: SchoolFormData): Result<null> {
    const school = School.fromFormData(schoolData)

    if (school.numTeams > this.shipTerms.length) {
      return { status: Status.Error, message: 'For mange hold, er løbet tør for gruppenavne!', data: null }
    }

    this.setSchools((schools) => [...schools, school])
    return this.okResult
  }

  addVisitTime(visitTimeData: VisitTimeFormData): Result<null> {
    const visitTime = VisitTime.fromFormData(visitTimeData)
    this.setVisitTime((visitTimes) => [...visitTimes, visitTime])
    return this.okResult
  }

  addVisit(visit: Visit): Result<null> {
    // if (this.visits.some((v) => v.company.id === visit.company.id && v.visitTime.id === visit.visitTime.id)) {
    //   return { status: Status.Error, message: 'Virksomheden har allerede et besøg på dette tidspunkt', data: null }
    // }

    // if (this.visits.some((v) => v.team.id === visit.team.id && v.visitTime.id === visit.visitTime.id)) {
    //   return { status: Status.Error, message: 'Holdet har allerede et besøg på dette tidspunkt', data: null }
    // }

    visit.id = uuidv4()
    this.setVisits((visits) => [...visits, visit])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  addCompanies(companies: CompanyFormData[]): Result<null> {
    const curSchools = [...this.companies]
    const results = companies.map((company) => this.addCompany(company))

    const error = results.find((result) => result.status === Status.Error)
    if (error) {
      this.setCompanies(curSchools)
      return { status: Status.Error, message: error.message, data: null }
    }

    return this.okResult
  }

  addSchools(schools: SchoolFormData[]): Result<null> {
    const curSchools = [...this.schools]
    const results = schools.map((school) => this.addSchool(school))

    const error = results.find((result) => result.status === Status.Error)
    if (error) {
      this.setSchools(curSchools)
      return { status: Status.Error, message: error.message, data: null }
    }

    return this.okResult
  }

  addVisitTimes(visitTimes: VisitTimeFormData[]): Result<null> {
    const curVisitTimes = [...this.vistTimes]
    const results = visitTimes.map((visitTime) => this.addVisitTime(visitTime))

    const error = results.find((result) => result.status === Status.Error)
    if (error) {
      this.setVisitTime(curVisitTimes)
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
    this.setVisits(this.visits.filter((visit) => visit.company.id !== companyId))
    return this.okResult
  }

  removeSchool(schoolId: string): Result<null> {
    const school = this.schools.find((school) => school.id === schoolId)

    if (!school) {
      return { status: Status.Error, message: 'Skole ikke fundet', data: null }
    }

    this.setSchools(this.schools.filter((school) => school.id !== schoolId))
    this.setVisits(this.visits.filter((visit) => visit.team.schoolId !== schoolId))
    return this.okResult
  }

  removeVisitTime(visitTimeId: string): Result<null> {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === visitTimeId)

    if (!visitTime) {
      return { status: Status.Error, message: 'Besøgstidspunkt ikke fundet', data: null }
    }

    this.setVisitTime(this.vistTimes.filter((visitTime) => visitTime.id !== visitTimeId))
    this.setVisits(this.visits.filter((visit) => visit.visitTime.id !== visitTimeId))

    return this.okResult
  }

  removeVisit(visitId: string): Result<null> {
    const visit = this.visits.find((visit) => visit.id === visitId)

    if (!visit) {
      return { status: Status.Error, message: 'Besøg ikke fundet', data: null }
    }

    this.setVisits(this.visits.filter((visit) => visit.id !== visitId))

    return this.okResult
  }

  /////////////////////////////////////////////////////////

  removeAllCompanies(): Result<null> {
    this.setCompanies([])
    this.setVisits([])
    return this.okResult
  }

  removeAllSchools(): Result<null> {
    this.setSchools([])
    this.setVisits([])
    return this.okResult
  }

  removeAllVisitTimes(): Result<null> {
    this.setVisitTime([])
    this.setVisits([])
    return this.okResult
  }

  removeAllVisits(): Result<null> {
    this.setVisits([])
    return this.okResult
  }

  /////////////////////////////////////////////////////////

  updateCompany(updatedCompanyData: CompanyFormData, companyId: string): Result<null> {
    const company = this.companies.find((company) => company.id === companyId)

    if (!company) {
      return { status: Status.Error, message: 'Virksomhed ikke fundet', data: null }
    }

    const result = company.updateFromFormData(updatedCompanyData)

    if (result.status === Status.Error) {
      return result
    }

    this.setCompanies(this.companies.map((c) => (c.id === companyId ? company : c)))
    return this.okResult
  }

  updateSchool(updatedSchoolData: SchoolFormData, schoolId: string): Result<null> {
    const school = this.schools.find((school) => school.id === schoolId)

    if (!school) {
      return { status: Status.Error, message: 'Skole ikke fundet', data: null }
    }

    const result = school.updateFromFormData(updatedSchoolData)

    if (result.status === Status.Error) {
      return result
    }

    this.setSchools(this.schools.map((s) => (s.id === schoolId ? school : s)))
    return this.okResult
  }

  updateVisitTime(updatedVisitTimeData: VisitTimeFormData, visitTimeId: string): Result<null> {
    const visitTime = this.vistTimes.find((visitTime) => visitTime.id === visitTimeId)

    if (!visitTime) {
      return { status: Status.Error, message: 'Besøgstidspunkt ikke fundet', data: null }
    }

    const result = visitTime.updateFromFormData(updatedVisitTimeData)

    if (result.status === Status.Error) {
      return result
    }

    this.setVisitTime(this.vistTimes.map((vt) => (visitTime.id === vt.id ? visitTime : vt)))
    return this.okResult
  }
}

export default StateHandler
