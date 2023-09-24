import getDashboard from '../requests/dashboard.js'
import { createSpinner } from 'nanospinner'
import Table from 'cli-table'
import chalk from 'chalk'

const summary = async (cookie: string) => {
    const spinner = createSpinner(chalk.green('Getting DashBoard...')).start()
    const AttendanceSummary = await getDashboard(cookie)
    if (AttendanceSummary) {
        spinner.success()
    }
    let table = new Table({ head: Object.keys(AttendanceSummary.displayData) })
    table.push(Object.values(AttendanceSummary.displayData))
    console.log(table.toString())

    table = new Table({
        head: AttendanceSummary.heading,
        colWidths: [8, 25, 15, 15, 15, 15, 15]
    })
    AttendanceSummary.tbody?.map((x) => table.push(x))
    console.log(table.toString())
}

export default summary
