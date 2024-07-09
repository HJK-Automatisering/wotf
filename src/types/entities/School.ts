import BaseEntity from './BaseEntity'
import { v4 as uuidv4 } from 'uuid'
import Result, { Status } from '../Result'
import SchoolFormData from '../entityFormData/SchoolFormData'

export interface SerializedSchool {
  id: string
  displayName: string
  name: string
  numTeams: number
  teams: SerializedTeam[]
}

export interface SerializedTeam {
  id: string
  schoolId: string
}

export interface Team {
  id: string
  schoolId: string
}

export default class School implements BaseEntity<SchoolFormData> {
  id: string
  displayName: string
  name: string
  numTeams: number
  teams: Team[]

  constructor(name: string, numTeams: number) {
    this.id = uuidv4()
    this.displayName = name
    this.name = name
    this.numTeams = numTeams
    this.teams = []

    for (let i = 0; i < numTeams; i++) {
      this.teams.push({ id: uuidv4(), schoolId: this.id })
    }
  }

  static fromFormData(formData: SchoolFormData): School {
    return new School(formData.name, parseInt(formData.numTeams))
  }

  static fromSerializedData(data: SerializedSchool): School {
    const school = new School(data.name, data.numTeams)
    school.id = data.id
    school.displayName = data.displayName
    school.teams = data.teams.map((team) => School.fromSerializedTeamData(team))

    return school
  }

  static fromSerializedTeamData(data: SerializedTeam): Team {
    return { id: data.id, schoolId: data.schoolId }
  }

  updateFromFormData(formData: SchoolFormData): Result<null> {
    this.displayName = formData.name
    this.name = formData.name

    const newNumTeams = parseInt(formData.numTeams)

    const difference = newNumTeams - this.numTeams

    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        this.teams.push({ id: uuidv4(), schoolId: this.id })
      }
    } else if (difference < 0) {
      this.teams = this.teams.slice(0, newNumTeams)
    }

    this.numTeams = newNumTeams

    return { status: Status.Success, message: '', data: null }
  }

  toFormData(): SchoolFormData {
    return {
      name: this.name,
      numTeams: this.numTeams.toString(),
    }
  }
}
