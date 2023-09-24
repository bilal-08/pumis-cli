import { createSpinner } from 'nanospinner'
import getAbsent from '../requests/absentDays.js'
import Table from 'cli-table'
import chalk from 'chalk'

createSpinner
const absentprompt = async (cookie: string) => {
    const spinner = createSpinner(chalk.green('Getting Absent Summary...')).start()

    const AbsentSummary = await getAbsent(cookie)
    if (AbsentSummary) {
        spinner.success()
    }
    const { heading, tbody, displayData } = AbsentSummary
    let table = new Table({ head: Object.keys(displayData) })
    table.push(Object.values(displayData))
    console.log(table.toString())
    heading.pop()
    table = new Table({
        head: heading,
        colWidths: [5, 30, 10, 10, 10]
    })
    tbody?.map((x) => {
        x.pop()
        table.push(x)
    })
    console.log(table.toString())
    return
}
export default absentprompt
