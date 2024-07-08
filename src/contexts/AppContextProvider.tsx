import { createContext, useEffect, useMemo, useState } from 'react'
import Company from '../types/Company'
import School from '../types/School'
import VisitTime from '../types/VisitTime'
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
  const [schedule, setSchedule] = useState<Visit[]>(loadedState.schedule)

  useEffect(() => {
    if (import.meta.env.VITE_PUBULATED === 'true') {
      setCompanies(fakeCompanies)
      setSchools(fakeSchools)
      setVisitTimes(fakeVisitTimes)
    }
  }, [])

  useEffect(() => {
    saveStateHandler.saveState({ companies, schools, visitTimes, schedule })
  }, [companies, schools, visitTimes, schedule, saveStateHandler])

  const contextValues = {
    stateHandler: new StateHandler(
      companies,
      setCompanies,
      schools,
      setSchools,
      visitTimes,
      setVisitTimes,
      schedule,
      setSchedule
    ),
  }

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
}

export default AppContextProvider
