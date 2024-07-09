import CompanyList from './components/CompanyList'
import SchoolList from './components/SchoolList'
import VisitPicker from './components/VisitPicker'
import VisitTimeList from './components/VisitTimeList'
import AppContextProvider from './contexts/AppContextProvider'

function App() {
  return (
    <AppContextProvider>
      <div className="flex justify-center w-full text-slate-600 min-h-screen">
        <div className="flex flex-col w-[900px] h-full p-5 space-y-5">
          <h1 className="font-bold text-2xl">WOTF Fordelingsværktøj</h1>
          <hr />
          <CompanyList />
          <SchoolList />
          <VisitTimeList />
          <VisitPicker />
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App
