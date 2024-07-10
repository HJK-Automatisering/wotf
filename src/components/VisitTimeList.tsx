import { useContext } from 'react'
import { Status } from '../types/Result'
import EntityList from './EntityList'
import { AppContext } from '../contexts/AppContextProvider'
import ImportHandler from '../handlers/ImportHandler'

const fields = [
  { name: 'startTime', label: 'Starttidspunkt', type: 'time' },
  { name: 'endTime', label: 'Sluttidspunkt', type: 'time' },
]

export default function CompanyList() {
  const { stateHandler } = useContext(AppContext)

  const getEntities = stateHandler.getVisitTimes.bind(stateHandler)

  const handleSubmitEntity = { handle: stateHandler.addVisitTime.bind(stateHandler) }

  const handleRemoveEntity = { handle: stateHandler.removeVisitTime.bind(stateHandler) }

  const handleUpdateEntity = { handle: stateHandler.updateVisitTime.bind(stateHandler) }

  const handleRemoveAllEntities = {
    safetyMessage: 'Er du sikker på at du vil slette alle besøgstider?',
    handle: stateHandler.removeAllVisitTimes.bind(stateHandler),
  }

  const handleImportEntities = {
    instructionMessage:
      'Kopier dine 2 kolonner med besøgstidsinformation fra Excel.\n' +
      'Kolonnerne bør stå i følgende rækkefølge:\n' +
      '| Starttid | Sluttid |\n' +
      'Tryk derefter på OK for at indsætte dataen i udklipsholderen.',
    handle: async () => {
      const result = await ImportHandler.getVisitTimesFromClipboard()

      if (result.status === Status.Error) {
        return { status: Status.Error, message: result.message, data: null }
      }
      return stateHandler.addVisitTimes(result.data)
    },
  }

  return (
    <EntityList
      title={`Besøgstider (${stateHandler.getVisitTimes().length})`}
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
