import { createContext, useEffect, useMemo, useState } from 'react'
import Company from '../types/Company'
import School from '../types/School'
import VisitTime from '../types/VisitTime'
import StateHandler from '../handlers/StateHandler'
import SaveStateHandler from '../handlers/SaveStateHandler'
import Visit from '../types/Visit'

interface AppContext {
  stateHandler: StateHandler
}

const getDefaultAppContext = (): AppContext => {
  return {
    stateHandler: new StateHandler(
      [],
      () => [],
      [],
      () => [],
      [],
      () => [],
      [],
      () => [],
      [],
      () => []
    ),
  }
}

export const AppContext = createContext<AppContext>(getDefaultAppContext())

function AppContextProvider({ children }: { children: JSX.Element }) {
  const saveStateHandler = useMemo(() => new SaveStateHandler(), [])
  const loadedState = saveStateHandler.loadState()

  const [companies, setCompanies] = useState<Company[]>(loadedState.companies)
  const [schools, setSchools] = useState<School[]>(loadedState.schools)
  const [visitTimes, setVisitTimes] = useState<VisitTime[]>(loadedState.visitTimes)
  const [schedule, setSchedule] = useState<Visit[]>(loadedState.schedule)
  const [shipTerms, setShipTerms] = useState<string[]>(loadedState.shipTerms)

  useEffect(() => {
    saveStateHandler.saveState({ companies, schools, visitTimes, schedule, shipTerms })
  }, [companies, schools, visitTimes, schedule, shipTerms, saveStateHandler])

  const contextValues = {
    stateHandler: new StateHandler(
      companies,
      setCompanies,
      schools,
      setSchools,
      visitTimes,
      setVisitTimes,
      schedule,
      setSchedule,
      shipTerms,
      setShipTerms
    ),
  }

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
}

export default AppContextProvider
