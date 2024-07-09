import School from '../types/entities/School'

const schoolsRaw = [
  {
    id: '087ad605-2a40-4716-8a88-6c3200eabd1b',
    displayName: 'EUD',
    name: 'EUD',
    numTeams: 1,
    teams: [
      {
        id: '6fe7a208-2883-4f33-bb54-ebe20d2c3948',
        schoolId: '087ad605-2a40-4716-8a88-6c3200eabd1b',
      },
    ],
  },
  {
    id: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
    displayName: 'Hirsthals skole',
    name: 'Hirsthals skole',
    numTeams: 5,
    teams: [
      {
        id: '8702bd57-b706-46c3-a9db-9d4e813c5249',
        schoolId: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
      },
      {
        id: '80f37618-e206-47e6-918c-eb3a3e479160',
        schoolId: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
      },
      {
        id: 'd6f6a244-6787-4a16-ae27-f85b960c64f3',
        schoolId: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
      },
      {
        id: 'f466523f-1579-447a-8d93-5e88820f7213',
        schoolId: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
      },
      {
        id: '7acd32f0-b5e4-4fa9-8e34-087da84ceb04',
        schoolId: '62b80e17-b9d8-45ab-9fd9-eeb4b81fcfdb',
      },
    ],
  },
  {
    id: 'cd363ef1-cc8a-40ee-8140-2fa8514d3169',
    displayName: 'Vends. Friskole',
    name: 'Vends. Friskole',
    numTeams: 2,
    teams: [
      {
        id: '5401c744-56b7-4585-9647-ec632988ad5c',
        schoolId: 'cd363ef1-cc8a-40ee-8140-2fa8514d3169',
      },
      {
        id: '21ee5cad-e913-4bd1-8c91-812709413d02',
        schoolId: 'cd363ef1-cc8a-40ee-8140-2fa8514d3169',
      },
    ],
  },
  {
    id: '81f60837-0262-4cc2-a30f-a19a3b990c84',
    displayName: 'Løkken',
    name: 'Løkken',
    numTeams: 3,
    teams: [
      {
        id: '207fb976-4136-494d-9f1c-abc2ae428bab',
        schoolId: '81f60837-0262-4cc2-a30f-a19a3b990c84',
      },
      {
        id: '8de79f41-fac7-4791-a7d6-4ecc45e4f8a8',
        schoolId: '81f60837-0262-4cc2-a30f-a19a3b990c84',
      },
      {
        id: '926a5be3-a809-4794-9208-63affa4fdf9a',
        schoolId: '81f60837-0262-4cc2-a30f-a19a3b990c84',
      },
    ],
  },
  {
    id: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
    displayName: 'Lundergaard',
    name: 'Lundergaard',
    numTeams: 5,
    teams: [
      {
        id: 'e494cf2a-8fa8-456c-85ca-199f79ea88df',
        schoolId: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
      },
      {
        id: '4e687942-cfe2-4bbf-bda3-b28b9dcb0df0',
        schoolId: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
      },
      {
        id: 'de1847c6-278e-417e-9951-0865f9ba711e',
        schoolId: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
      },
      {
        id: 'a54bfb26-32ff-4b33-b30d-8dd59c8d8381',
        schoolId: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
      },
      {
        id: 'e18b2359-0f1c-474e-8e87-f20227b1b299',
        schoolId: '0c9d913f-3b80-4871-94b8-176eb5d7e98e',
      },
    ],
  },
  {
    id: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
    displayName: 'HPR',
    name: 'HPR',
    numTeams: 6,
    teams: [
      {
        id: '26afbb80-2385-4623-86f7-4a3b766e1076',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
      {
        id: '88ea7c50-f40f-405d-b782-53d430a9eea0',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
      {
        id: '70c5c351-7fb0-4d36-ba4b-93ab362688d6',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
      {
        id: 'c004db7b-03bf-40e0-bf5c-1b46c975f85a',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
      {
        id: '8e6a4b3c-8c0b-4708-ad85-e657b5c027bd',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
      {
        id: 'a9ab6696-a196-4bd2-ad13-76e79f7ab4bd',
        schoolId: '363bac8a-ba4c-439a-8fed-ebeaeacfbfc2',
      },
    ],
  },
  {
    id: '7f395402-c425-42b5-82fb-f301b18e1976',
    displayName: 'Sindal prv.',
    name: 'Sindal prv.',
    numTeams: 1,
    teams: [
      {
        id: '5b479296-88c0-419a-8221-2b0cd5ed858a',
        schoolId: '7f395402-c425-42b5-82fb-f301b18e1976',
      },
    ],
  },
]

const schools: School[] = schoolsRaw.map((school) => new School(school.name, school.numTeams))

export default schools
