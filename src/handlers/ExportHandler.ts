import exceljs from 'exceljs'
import Visit from '../types/Visit'
import Result, { Status } from '../types/Result'
import School from '../types/entities/School'
import shipTerms from '../data/shipTerms'

export default class ExportHandler {
  static async exportVisitsToExcel(visits: Visit[], schools: School[]): Promise<Result<null>> {
    const groupedVisits: Partial<Record<string, Visit[]>> = Object.groupBy(visits, (visit) => visit.team.id)
    const teamNames = [...shipTerms]

    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet('Besøg')

    const imagePath = './wotf-logo.png'
    const response = await fetch(imagePath)
    const arrayBuffer = await response.arrayBuffer()

    const imageId = workbook.addImage({
      buffer: arrayBuffer,
      extension: 'png',
    })

    let rowCount = 1

    Object.keys(groupedVisits).forEach((teamId) => {
      const visits = groupedVisits[teamId]!.sort(
        (a, b) => a.visitTime.startTime.getTime() - b.visitTime.startTime.getTime()
      )
      const team = visits[0].team
      const school = schools.find((school) => school.id === team.schoolId)

      if (!school) return { status: Status.Error, message: 'Kunne ikke finde skole', data: null }

      worksheet.getColumn(1)

      for (let i = 1; i < 8; i++) {
        const col = worksheet.getColumn(i)

        if (i == 1) {
          col.style = { font: { size: 12, bold: true } }
        } else {
          col.style = { font: { size: 12 } }
        }
        col.width = 12
      }

      let row: exceljs.Row = worksheet.getRow(rowCount)

      // Add team name
      row.values = ['Skole:', null, null, null, school.name]
      rowCount += 1
      worksheet.getRow(rowCount).values = ['Hold:', null, null, null, teamNames.shift()]
      rowCount += 3

      // Add teacher
      row = worksheet.getRow(rowCount)
      row.values = ['Lærer/Cykelguide:']
      for (let i = 5; i < 8; i++) {
        row.getCell(i).border = { bottom: { style: 'thin' } }
      }
      rowCount += 3

      // Add students
      row = worksheet.getRow(rowCount)
      row.values = ['Elever:']
      rowCount += 2

      for (let i = 0; i < 5; i++) {
        const row = worksheet.getRow(rowCount)

        for (let i = 1; i < 8; i++) {
          if (i !== 4) row.getCell(i).border = { bottom: { style: 'thin' } }
        }

        rowCount += 2
      }

      // Add timeplan
      row = worksheet.getRow(rowCount)
      row.values = ['Tidsplan:']
      rowCount += 2

      visits.forEach((visit) => {
        row = worksheet.getRow(rowCount)
        row.getCell(1).font = { bold: false, size: 12 }
        row.getCell(1).value = 'Kl: ' + visit.visitTime.displayName
        row.getCell(3).value = visit.company.name + ' /v ' + visit.company.contactPerson
        rowCount += 1
        row = worksheet.getRow(rowCount)
        row.getCell(3).value = visit.company.address
        rowCount += 1
        row = worksheet.getRow(rowCount)
        row.getCell(3).value = visit.company.website
        rowCount += 3
      })

      // Add image
      worksheet.addImage(imageId, {
        tl: { col: 6, row: rowCount },
        ext: { width: 50, height: 50 },
      })
      rowCount += 3

      // Add print page
      row = worksheet.getRow(rowCount)
      row.addPageBreak()
      rowCount += 1
    })

    workbook.xlsx.write

    return await ExportHandler.downloadExcelFile(workbook)
  }

  private static async downloadExcelFile(workbook: exceljs.Workbook): Promise<Result<null>> {
    try {
      const buffer = await workbook.xlsx.writeBuffer()
      const fileType = 'application/vnd.opemxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      const blob = new Blob([buffer], { type: fileType })

      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', 'Holdsedler.xlsx')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return { status: Status.Success, message: '', data: null }
    } catch {
      return { status: Status.Error, message: 'Kunne ikke download Excelark', data: null }
    }
  }
}
