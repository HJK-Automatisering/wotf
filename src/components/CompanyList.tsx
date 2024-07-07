import { FormEvent, useContext, useState } from 'react'
import { AppContext } from '../contexts/AppContextProvider'
import ListHeader from './ListHeader'
import ResultBox from './ResultBox'
import Result, { Status } from '../types/Result'
import ImportHandler from '../handlers/ImportHandler'

export default function CompanyList() {
  const { stateHandler } = useContext(AppContext)
  const [hidden, setHidden] = useState<boolean>(false)
  const [addingOpen, setAddingOpen] = useState<boolean>(false)
  const [beingEdited, setBeingEdited] = useState<string[]>([])
  const [result, setResult] = useState<Result<unknown> | null>(null)

  const companies = stateHandler.getCompanies()

  function handleRemoveAllCompanies() {
    if (!confirm('Er du sikker på at du vil fjerne alle virksomheder?')) return
    setAddingOpen(false)
    setBeingEdited([])
    setResult(stateHandler.removeAllCompanies())
  }

  function handleSubmitCompany(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const company = {
      id: '',
      name: formData.get('name') as string,
      contactPerson: formData.get('contact-person') as string,
      phone: formData.get('phone') as string,
      email: formData.get('mail') as string,
      adress: formData.get('adress') as string,
      website: formData.get('website') as string,
    }
    setAddingOpen(false)
    setResult(stateHandler.addCompany(company))
  }

  function handleCancelAddCompany() {
    setAddingOpen(false)
  }

  function handleToggleHidden() {
    setHidden(!hidden)
  }

  async function handleImportCompanies() {
    if (
      !confirm(
        'Kopier dine 6 kolonner med virksomhedsinformation fra Excel.\nKolonnerne bør stå i følgende rækkefølge:\n| Navn | Kontaktperson | Telefon | Mail | Adresse | Hjemmeside |\nTryk denæst på OK for at indsætte dataen i udklipsholderen.'
      )
    )
      return
    const importResult = await ImportHandler.getCompaniesFromClipboard()
    setResult(importResult)
    if (importResult.status === Status.Success) {
      setResult(stateHandler.addCompanies(importResult.data))
    }
  }

  function handleAddCopany() {
    setAddingOpen(true)
  }

  function handleUpdateCompany(e: FormEvent<HTMLFormElement>, companyId: string) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const company = {
      id: companyId,
      name: formData.get('name') as string,
      contactPerson: formData.get('contact-person') as string,
      phone: formData.get('phone') as string,
      email: formData.get('mail') as string,
      adress: formData.get('adress') as string,
      website: formData.get('website') as string,
    }
    setBeingEdited(beingEdited.filter((id) => id !== companyId))
    setResult(stateHandler.updateCompany(company))
  }

  function handleCancelUpdateCompany(companyId: string) {
    setBeingEdited(beingEdited.filter((id) => id !== companyId))
  }

  return (
    <div className="flex flex-col w-full space-y-3">
      <ListHeader
        title={`Virksomheder (${companies.length})`}
        buttons={[
          {
            text: hidden ? 'Vis' : 'Skjul',
            onClick: handleToggleHidden,
          },
          {
            text: 'Ryd',
            onClick: handleRemoveAllCompanies,
          },
          {
            text: 'Importer',
            onClick: handleImportCompanies,
          },
          {
            text: 'Tilføj',
            onClick: handleAddCopany,
          },
        ]}
      />
      {!hidden && (
        <>
          <ResultBox result={result} />
          {addingOpen && (
            <div className="bg-white rounded p-2 shadow ">
              <form onSubmit={(e) => handleSubmitCompany(e)} className="flex-col grid grid-cols-3 gap-2">
                <p>Navn:</p>
                <input name="name" className="border rounded px-1" type="text" required />
                <div className="ml-auto flex space-x-2">
                  <button type="submit" className="text-blue-500">
                    Bekræft
                  </button>
                  <button type="button" className="text-red-500" onClick={handleCancelAddCompany}>
                    Afbryd
                  </button>
                </div>
                <p>Kontaktperson:</p>
                <input name="contact-person" className="border rounded px-1" type="text" required />
                <div></div>
                <p>Telefon:</p>
                <input name="phone" className="border rounded px-1" type="text" required />
                <div></div>
                <p>Mail:</p>
                <input name="mail" className="border rounded px-1" type="text" required />
                <div></div>
                <p>Adresse:</p>
                <input name="adress" className="border rounded px-1" type="text" required />
                <div></div>
                <p>Hjemmeside:</p>
                <input name="website" className="border rounded px-1" type="text" required />
                <div></div>
              </form>
            </div>
          )}
          <div className="bg-white rounded p-2 shadow">
            {companies.map((company, idx) => (
              <div key={idx}>
                {beingEdited.includes(company.id) ? (
                  <form
                    onSubmit={(e) => handleUpdateCompany(e, company.id)}
                    className="flex-col grid grid-cols-3 gap-2"
                  >
                    <p>Navn:</p>
                    <input
                      name="name"
                      defaultValue={company.name}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div className="ml-auto flex space-x-2">
                      <button type="submit" className="text-blue-500">
                        Gem
                      </button>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleCancelUpdateCompany(company.id)}
                      >
                        Afbryd
                      </button>
                    </div>
                    <p>Kontaktperson:</p>
                    <input
                      name="contact-person"
                      defaultValue={company.contactPerson}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div></div>
                    <p>Telefon:</p>
                    <input
                      name="phone"
                      defaultValue={company.phone}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div></div>
                    <p>Mail:</p>
                    <input
                      name="mail"
                      defaultValue={company.email}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div></div>
                    <p>Adresse:</p>
                    <input
                      name="adress"
                      defaultValue={company.adress}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div></div>
                    <p>Hjemmeside:</p>
                    <input
                      name="website"
                      defaultValue={company.website}
                      className="border rounded px-1"
                      type="text"
                      required
                    />
                    <div></div>
                  </form>
                ) : (
                  <div className="flex">
                    <p>{company.name}</p>
                    <div className="ml-auto flex space-x-2">
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setBeingEdited([...beingEdited, company.id])
                        }}
                      >
                        Rediger
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          setResult(stateHandler.removeCompany(company.id))
                        }}
                      >
                        Slet
                      </button>
                    </div>
                  </div>
                )}

                {idx < companies.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
