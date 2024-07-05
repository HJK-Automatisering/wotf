export default interface School {
  id: string
  name: string
  numTeams: number
  teams: Team[]
}

export interface Team {
  id: string
  name: string
  schoolId: string
}
