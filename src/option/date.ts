import inquirer from 'inquirer'
import getAttendanceByDate from '../requests/AttendanceBydate.js'
import chalk from 'chalk'
//@ts-ignore
import DatePrompt from 'inquirer-date-prompt'
import Table from 'cli-table'
import { createSpinner } from 'nanospinner'

const dateprompt = (cookie: string) => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'of which day you would like to see the Attendance ? ',
                choices: ['Today', new inquirer.Separator(" "), 'Enter A day', new inquirer.Separator(" ")]
            }
        ])
        .then(async (choice) => {
            if (choice.option == 'Today') {
                let currentDate: string | Date = new Date()
                const dd = String(currentDate.getDate()).padStart(2, '0') as string
                const mm = String(currentDate.getMonth() + 1).padStart(2, '0') as string
                const yyyy = currentDate.getFullYear().toString() as string

                currentDate = `${dd}-${mm}-${yyyy}`
                console.log('current date :', chalk.cyanBright(currentDate))
                const data = await getAttendanceByDate(cookie, encodeURI(currentDate))
                if (data.status == 'error') return console.log(chalk.magenta(data.message))
                const table = new Table({
                    head: data.heading,
                    colWidths: [20, 15, 15, 20, 20, 15]
                })
                data.tbody?.map((x) => table.push(x))
                console.log(table.toString())
            } else {
                inquirer.registerPrompt('date', DatePrompt)
                const date = new Date()
                await inquirer
                    .prompt({
                        type: 'date',
                        name: 'timestamp',
                        message: 'Enter a date : ',
                        prefix: ' 📅 ',
                        default: date,
                        filter: (d) => d.toLocaleString('en-GB'),
                        transformer: (s) => chalk.bold.green(s),
                        locale: 'en-GB',
                        format: { month: 'short', hour: undefined, minute: undefined },
                        clearable: true
                    })
                    .then(async (date) => {
                        const spinner = createSpinner(chalk.green('Getting Attendance from a Specific Date...')).start()
                        const data = await getAttendanceByDate(
                            cookie,
                            encodeURI(date.timestamp.slice(0, 10).replaceAll('/', '-'))
                        )
                        if (data) spinner.success()
                        if (data.status == 'error') return console.log(data.message)
                        const table = new Table({
                            head: data.heading,
                            colWidths: [20, 15, 15, 20, 20, 15]
                        })
                        data.tbody?.map((x) => table.push(x))
                        console.log(table.toString())
                    })
            }
            return
        })
    return
}

export default dateprompt
