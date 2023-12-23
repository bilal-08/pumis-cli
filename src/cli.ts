#! /usr/bin/env node

import { Command } from 'commander'
import login from './requests/login.js'
import chalk from 'chalk'
import { createSpinner } from 'nanospinner'
import { dbhandler } from './store/localdb.js'
import dateprompt from './option/date.js'
import absentprompt from './option/absent.js'
import summary from './option/summary.js'
const db = new dbhandler()
db.startDb()
const program = new Command()

program.name('pumis-cli').description('CLI tool to get Attendance right from your terminal')

const command = program
    .description('get your display data of attendance')
    .argument('username', 'your username')
    .argument('password', 'your password')
    .option('-d, --date', 'get data by date')
    .option('-a, --absent, --absentdays', 'get Absent days data')

command.action(async (username, password, option) => {
    const spinner = createSpinner('Login into you').start()
    let cookie: string
    cookie = await login(username, password, spinner)
    if (cookie) {
        spinner.success({ text: chalk.green('Sucessfully Logged in') })
    }

    if (option.date) {
        return dateprompt(cookie)
    } else if (option.absent) {
        return absentprompt(cookie)
    }

    return summary(cookie)
})
program.parse()
