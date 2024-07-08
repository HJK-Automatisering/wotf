import { useContext } from 'react'
import { Status } from '../types/Result'
import EntityList from './EntityList'
import { AppContext } from '../contexts/AppContextProvider'
import ImportHandler from '../handlers/ImportHandler'

const fields = [
  { name: 'name', label: 'Navn' },
  { name: 'contactPerson', label: 'Kontaktperson' },
  { name: 'phone', label: 'Telefon' },
  { name: 'email', label: 'Mail' },
  { name: 'address', label: 'Adresse' },
  { name: 'website', label: 'Hjemmeside' },
]

export default function CompanyList() {
  const { stateHandler } = useContext(AppContext)

  const getEntities = stateHandler.getCompanies.bind(stateHandler)

  const handleSubmitEntity = { handle: stateHandler.addCompany.bind(stateHandler) }

  const handleRemoveEntity = { handle: stateHandler.removeCompany.bind(stateHandler) }

  const handleUpdateEntity = { handle: stateHandler.updateCompany.bind(stateHandler) }

  const handleRemoveAllEntities = {
    safetyMessage: 'Er du sikker på at du vil slette alle virksomheder?',
    handle: stateHandler.removeAllCompanies.bind(stateHandler),
  }

  const handleImportEntities = {
    instructionMessage:
      'Kopier dine 6 kolonner med virksomhedsinformation fra Excel.\n' +
      'Kolonnerne bør stå i følgende rækkefølge:\n' +
      '| Navn | Kontaktperson | Telefon | Mail | Adresse | Hjemmeside |\n' +
      'Tryk derefter på OK for at indsætte dataen i udklipsholderen.',
    handle: async () => {
      const result = await ImportHandler.getCompaniesFromClipboard()

      if (result.status === Status.Error) {
        return { status: Status.Error, message: result.message, data: null }
      }
      return stateHandler.addCompanies(result.data)
    },
  }

  return (
    <EntityList
      title={`Virksomheder (${stateHandler.getCompanies().length})`}
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
