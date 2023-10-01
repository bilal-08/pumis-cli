import axios from 'axios'
import getheaders from '../utils/getheaders.js'
import * as cheerio from 'cheerio'
import crypto from 'crypto'
import https from 'https'
const getAttendanceByDate = async (cookie: string, date: string) => {
    const headers = getheaders(cookie)
    const MonthDate = await axios
        .get(
            `https://ums.paruluniversity.ac.in/AdminPanel/TimeTable/TTM_Attendance/TTM_AttendanceViewStudentAttendanceDetailByDate.aspx?AttendanceDate=${date}`,
            { headers,httpsAgent:new https.Agent({secureOptions:crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }) }
        )
        .catch((x) => x)
    let heading: string[] = []
    let tbody: Array<string[]> = []
    const $ = cheerio.load(MonthDate.data)

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

    return tbody.length < 1 ? { status: 'error', message: "data doesn't exists" } : { status: 'ok', heading, tbody }
}

export default getAttendanceByDate
