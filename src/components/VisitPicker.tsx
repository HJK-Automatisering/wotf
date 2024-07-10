import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../contexts/AppContextProvider'
import ListHeader from './ListHeader'
import Company from '../types/entities/Company'
import { Team } from '../types/entities/School'
import Visit from '../types/Visit'
import ColorHandler from '../handlers/ColorHandler'

interface Cell {
  company: Company
  team: Team
}

export default function VisitPicker() {
  const { stateHandler } = useContext(AppContext)

  const [hidden, setHidden] = useState<boolean>(false)
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)

  const topRightRef = useRef<HTMLDivElement | null>(null)
  const botRightRef = useRef<HTMLDivElement | null>(null)

  const companies = stateHandler.getCompanies()
  const schools = stateHandler.getSchools()
  const visitTimes = stateHandler.getVisitTimes()
  const visits = stateHandler.getVisits()

  function handleToggleHidden() {
    setHidden(!hidden)
  }

  function handleRemoveAllVisits() {
    stateHandler.removeAllVisits()
  }

  function handleSetVisitedCell(company: Company, team: Team) {
    const visit = hasVisit(company, team)
    if (visit) {
      const visitTimeIdx = visitTimes.findIndex((vt) => vt.id === visit.visitTime.id)
      const nextVisitTimeIdx = visitTimeIdx + 1

      stateHandler.removeVisit(visit.id)

      if (nextVisitTimeIdx < visitTimes.length) {
        stateHandler.addVisit(new Visit(company, team, visitTimes[nextVisitTimeIdx]))
      }
    } else {
      const visit = new Visit(company, team, stateHandler.getVisitTimes()[0])
      console.log(visit)
      stateHandler.addVisit(visit)
    }
  }

  function isHoveredCell(company: Company, team: Team) {
    return hoveredCell?.company.id === company.id && hoveredCell.team.id === team.id
  }

  function isSameColRowCell(company: Company, team: Team) {
    const hoveredCompanyIdx = companies.findIndex((c) => c.id === hoveredCell?.company.id)
    const companyIdx = companies.findIndex((c) => c.id === company.id)

    const hoveredTeamIdx = schools.flatMap((s) => s.teams).findIndex((t) => t.id === hoveredCell?.team.id)
    const teamIdx = schools.flatMap((s) => s.teams).findIndex((t) => t.id === team.id)

    return (
      hoveredCompanyIdx >= companyIdx &&
      hoveredTeamIdx >= teamIdx &&
      (hoveredCompanyIdx === companyIdx || hoveredTeamIdx === teamIdx)
    )
  }

  function hasVisit(company: Company, team: Team) {
    return visits.find((visit) => visit.company.id === company.id && visit.team.id === team.id)
  }

  function getBackgroundColor(company: Company, team: Team) {
    const visit = hasVisit(company, team)

    if (visit) {
      return ColorHandler.generatePastelColor(visit.visitTime.displayName)
    } else if (isHoveredCell(company, team)) {
      return '#e2e8f0'
    } else if (isSameColRowCell(company, team)) {
      return '#f1f5f9'
    } else {
      return '#FFFFFF'
    }
  }

  function getCellText(company: Company, team: Team) {
    const visit = hasVisit(company, team)
    return visit ? visit.visitTime.displayName.replace(' - ', '\n') : ''
  }

  useEffect(() => {
    const topRightDiv = topRightRef.current
    const botRightDiv = botRightRef.current

    const syncScroll = (event: Event) => {
      const uiEvent = event as UIEvent

      if (topRightDiv && uiEvent.target === topRightDiv) {
        if (botRightDiv) botRightDiv.scrollLeft = topRightDiv.scrollLeft
      } else if (botRightDiv && uiEvent.target === botRightDiv) {
        if (topRightDiv) topRightDiv.scrollLeft = botRightDiv.scrollLeft
      }
    }

    if (topRightDiv && botRightDiv) {
      topRightDiv.addEventListener('scroll', syncScroll as EventListener)
      botRightDiv.addEventListener('scroll', syncScroll as EventListener)

      return () => {
        topRightDiv.removeEventListener('scroll', syncScroll as EventListener)
        botRightDiv.removeEventListener('scroll', syncScroll as EventListener)
      }
    }
  }, [])

  return (
    <div className="pb-44">
      <ListHeader
        title={`Besøg (${stateHandler.getVisits().length})`}
        buttons={[
          { text: hidden ? 'Vis' : 'Skjul', onClick: handleToggleHidden },
          { text: 'Ryd', onClick: handleRemoveAllVisits },
          { text: 'Eksporter', onClick: handleRemoveAllVisits, width: 100 },
        ]}
      />
      {!hidden && (
        <div className="flex cus-container max-h-[500px] flex-col p-0">
          {/* Top */}
          <div className="flex flex-row sticky top-0 bg-white border-b-2 border-slate-400">
            {/* Top left*/}
            <div className="flex flex-col min-h-full min-w-[25%] border-e-2 border-slate-400"></div>
            {/* Top right*/}
            <div ref={topRightRef} className="flex flex-col h-full overflow-x-auto hide-scrollbar">
              <div className="flex">
                {schools.map((school) => (
                  <div
                    key={school.id}
                    className={`flex flex-row justify-center h-full border-e-2 p-1 ${
                      hoveredCell?.team.schoolId === school.id ? 'bg-slate-200' : ''
                    }`}
                    style={{ minWidth: school.numTeams * 40 }}
                  >
                    <p className="truncate text-sm">{school.name}</p>
                  </div>
                ))}
              </div>
              <div className="flex">
                {schools.map((school) =>
                  school.teams.map((team, idx) => (
                    <div
                      key={team.id}
                      className={`flex min-w-10 w-10 h-6 ${idx === school.numTeams - 1 ? 'border-e-2' : ''} ${
                        hoveredCell?.team.id === team.id ? 'bg-slate-200' : ''
                      }`}
                    >
                      <p className="truncate text-sm w-full text-center">{idx + 1}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bot */}
          <div className="flex flex-row">
            {/* Bot left */}
            <div className="flex flex-col w-1/4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`flex flex-col border-b border-e-slate-400 border-e-2 h-6 ${
                    hoveredCell?.company.id === company.id ? 'bg-slate-200' : ''
                  }`}
                >
                  <p className="truncate text-sm px-2">{company.name}</p>{' '}
                </div>
              ))}
            </div>

            {/* Bot right */}
            <div ref={botRightRef} className="flex flex-col overflow-x-auto h-full">
              <div>
                {companies.map((company) => (
                  <div key={company.id} className="flex flex-row">
                    {schools.map((school) =>
                      school.teams.map((team, idx) => (
                        <button
                          key={team.id}
                          onClick={() => handleSetVisitedCell(company, team)}
                          onMouseOver={() => setHoveredCell({ company, team })}
                          className={`flex flex-col p-0.5 min-w-10 w-10 border-e border-b h-6 ${
                            idx === school.numTeams - 1 ? 'border-e-2' : ''
                          }`}
                        >
                          <div
                            className={`h-full w-full ${hasVisit(company, team) ? 'rounded' : ''}`}
                            style={{ backgroundColor: getBackgroundColor(company, team) }}
                          >
                            <p className="truncate text-[6px] font-semibold text-center whitespace-break-spaces text-white">
                              {getCellText(company, team)}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
