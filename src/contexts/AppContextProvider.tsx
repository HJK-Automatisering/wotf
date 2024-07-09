import { createContext, useEffect, useMemo, useState } from 'react'
import Company from '../types/entities/Company'
import School from '../types/entities/School'
import VisitTime from '../types/entities/VisitTime'
import StateHandler from '../handlers/StateHandler'
import SaveStateHandler from '../handlers/SaveStateHandler'
import Visit from '../types/Visit'
import fakeCompanies from '../data/fakeCompanies'
import fakeSchools from '../data/fakeSchools'
import fakeVisitTimes from '../data/fakeVisitTimes'

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
  const [visits, setVisits] = useState<Visit[]>(loadedState.visits)

  useEffect(() => {
    if (import.meta.env.VITE_PUBULATED === 'true') {
      setCompanies(fakeCompanies)
      setSchools(fakeSchools)
      setVisitTimes(fakeVisitTimes)
    }
  }, [])

  useEffect(() => {
    saveStateHandler.saveState({ companies, schools, visitTimes, visits: visits })
  }, [companies, schools, visitTimes, visits, saveStateHandler])

  const contextValues = {
    stateHandler: new StateHandler(
      companies,
      setCompanies,
      schools,
      setSchools,
      visitTimes,
      setVisitTimes,
      visits,
      setVisits
    ),
  }

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
}

export default AppContextProvider
