import { useContext } from 'react'
import { Status } from '../types/Result'
import EntityList from './EntityList'
import { AppContext } from '../contexts/AppContextProvider'
import ImportHandler from '../handlers/ImportHandler'

const fields = [
  { name: 'name', label: 'Navn' },
  { name: 'numTeams', label: 'Antal hold', type: 'number', options: { min: 1, max: 100 } },
]

export default function SchoolList() {
  const { stateHandler } = useContext(AppContext)

  const getEntities = stateHandler.getSchools.bind(stateHandler)

  const handleSubmitEntity = { handle: stateHandler.addSchool.bind(stateHandler) }

  const handleRemoveEntity = { handle: stateHandler.removeSchool.bind(stateHandler) }

  const handleUpdateEntity = { handle: stateHandler.updateSchool.bind(stateHandler) }

  const handleRemoveAllEntities = {
    safetyMessage: 'Er du sikker på at du vil slette alle skoler?',
    handle: stateHandler.removeAllSchools.bind(stateHandler),
  }

  const handleImportEntities = {
    instructionMessage:
      'Kopier dine 2 kolonner med skoleinformation fra Excel.\n' +
      'Kolonnerne bør stå i følgende rækkefølge:\n' +
      '| Navn | Antal klasser |\n' +
      'Tryk derefter på OK for at indsætte dataen i udklipsholderen.',
    handle: async () => {
      const result = await ImportHandler.getSchoolsFromClipboard()

      if (result.status === Status.Error) {
        return { status: Status.Error, message: result.message, data: null }
      }
      return stateHandler.addSchools(result.data)
    },
  }

  const schools = stateHandler.getSchools()

  return (
    <EntityList
      title={`Skoler (${schools.length}) | Hold (${schools.flatMap((school) => school.teams).length})`}
      fields={fields}
      utils={{
        getEntities,
        handleRemoveAllEntities,
        handleSubmitEntity,
        handleImportEntities,
        handleRemoveEntity,
        handleUpdateEntity,
      }}
    />
  )
}
