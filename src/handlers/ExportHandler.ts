import exceljs from 'exceljs'
import Visit from '../types/Visit'
import Result, { Status } from '../types/Result'

export default class ExportHandler {
  static async exportVisitsToExcel(visits: Visit[]): Promise<Result<null>> {
    const groupedVisits = Object.groupBy(visits, (visit) => visit.team.id)

    console.log(groupedVisits)

    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet('Besøg')

    worksheet.eachRow((row) => {
      row.height = 19
      row.font = { size: 14 }
    })

    worksheet.columns = [
      { header: 'Virksomhed', key: 'company', width: 32 },
      { header: 'Skole', key: 'school', width: 32 },
      { header: 'Hold', key: 'team', width: 32 },
      { header: 'Besøgstid', key: 'visitTime', width: 32 },
    ]

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
