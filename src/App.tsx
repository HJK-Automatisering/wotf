import AppContextProvider from './contexts/AppContextProvider'

function App() {
  return (
    <AppContextProvider>
      <div className="flex justify-center w-full text-slate-600">
        <div className="flex min-w-[900px] max-w-[1200px] h-full p-5 bg-gray-50">
          <h1 className="font-bold text-2xl">WOTF Fordelingsværktøj</h1>
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App
