import axios from 'axios'
import getheaders from '../utils/getheaders.js'
import * as cheerio from 'cheerio'
import chalk from 'chalk'
import crypto from 'crypto'
import https from 'https'
const getAbsent = async (cookie: string) => {
    const headers = getheaders(cookie)
    const res = await axios.get(
        'https://ums.paruluniversity.ac.in/StudentPanel/TTM_Attendance/TTM_Attendance_StudentAbsentDays.aspx',
        { headers,httpsAgent:new https.Agent({secureOptions:crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }) }
    )
    let $ = cheerio.load(res.data)
    let heading: string[] = []
    let tbody: Array<string[]> = []

    $ = cheerio.load(res.data)

    const displayData = {
        Partial: chalk.hex('E08283').bold($('#ctl00_cphPageContent_lblPartialAbsentDaysCount').text()),
        full: chalk.hex('f36a5a').bold($('#ctl00_cphPageContent_lblFullAbsentDaysCount').text()),
        total: chalk.hex('D91E18').bold($('#ctl00_cphPageContent_lblTotalAbsentLectureLabCount').text())
    }

    const table = $('#tblAttendance')
    table
        .find('thead')
        .find('tr')
        .find('th')
        .each((i, element) => {
            heading.push($(element).find('span').text())
        })

    let temp: string[] = []
    table
        .find('tbody')
        .find('tr')
        .find('td')
        .each((i, element) => {
            temp.push($(element).text().trim())
            if (temp.length == heading.length) {
                tbody.push(temp)
                temp = []
            }
        })
    return { heading, tbody, displayData }
}

export default getAbsent
