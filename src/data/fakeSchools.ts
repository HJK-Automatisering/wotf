import School from '../types/School'

const schools: School[] = [
  {
    id: '1',
    name: 'Højene Skole',
    numTeams: 3,
    teams: [
      { id: '1', schoolId: '1', name: 'Aksel' },
      { id: '2', schoolId: '1', name: 'Kompas' },
      { id: '3', schoolId: '1', name: 'Motor' },
    ],
  },
  {
    id: '2',
    name: 'Vestervang Skole',
    numTeams: 2,
    teams: [
      { id: '4', schoolId: '2', name: 'Stævn' },
      { id: '5', schoolId: '2', name: 'Gear' },
    ],
  },
  {
    id: '3',
    name: 'Søndervang Skole',
    numTeams: 1,
    teams: [{ id: '6', schoolId: '3', name: 'Kahyt' }],
  },
]

export default schools
