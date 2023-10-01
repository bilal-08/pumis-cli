import axios, { AxiosResponse } from 'axios'
import getheaders from '../utils/getheaders.js'
import * as cheerio from 'cheerio'
import chalk from 'chalk'
import crypto from 'crypto'
import https from 'https'
const isRedirected = (link: AxiosResponse): Boolean => {
    const path = link.request.res.client._httpMessage.path
    return path == '/Login.aspx' ? true : false
}
const getDashboard = async (cookie: string) => {
    const headers = getheaders(cookie)
    const res = await axios.get(
        'https://ums.paruluniversity.ac.in/StudentPanel/TTM_Attendance/TTM_Attendance_StudentAttendance.aspx',
        { headers,httpsAgent:new https.Agent({secureOptions:crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }) }
    )
    let $ = cheerio.load(res.data)
    if (isRedirected(res) && $('#ucMessage_lblError')) throw 'Username or password maybe wrong'
    let heading: string[] = []
    let tbody: Array<string[]> = []

    $ = cheerio.load(res.data)

    const displayData = {
        name: chalk.blue($('#ctl00_lblCurrentUsername').text()),
        totalSlots: chalk.hex('8E44AD').bold($('#ctl00_cphPageContent_lblTotalLectureLabCount').text()),
        present: chalk.hex('45b6af').bold($('#ctl00_cphPageContent_lblPresentLectureLabCount').text()),
        absent: chalk.hex('e7505a').bold($('#ctl00_cphPageContent_lblAbsentLectureLabCount').text()),
        presentPercentage: chalk.hex('3598dc').bold($('#ctl00_cphPageContent_lblPresentPCTCount').text() + '%')
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

export default getDashboard
