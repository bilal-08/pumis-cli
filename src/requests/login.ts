import axios, { AxiosResponse } from 'axios'
import FormData from 'form-data'
import getPayload from '../utils/getPayload.js'
import getheaders from '../utils/getheaders.js'
import chalk from 'chalk'
import crypto from 'crypto'
import https from 'https'

const isRedirected = (link: AxiosResponse): Boolean => {
    const path = link.request.res.client._httpMessage.path
    return path == '/Login.aspx' ? true : false
}
const login = async (username: string, password: string, spinner: any) => {
    const { viewState, viewStateGenerator, viewStateEncrypted, cookie } = await getPayload()
    const headers = getheaders(cookie)

    try {
        let form = new FormData()
        form.append('__LASTFOCUS', '')
        form.append('__EVENTTARGET', '')
        form.append('__EVENTARGUMENT', '')

        form.append('__VIEWSTATE', viewState)
        form.append('__VIEWSTATEGENERATOR', viewStateGenerator)
        form.append('__VIEWSTATEENCRYPTED', viewStateEncrypted)
        form.append('hfWidth', '581')
        form.append('hfHeight', '619')
        form.append('hfLoginMethod', '')

        form.append('txtUsername', encodeURI(username))
        form.append('txtPassword', encodeURI(password))
        form.append('btnLogin', 'Login')
        const res = await axios.post('https://ums.paruluniversity.ac.in/Login.aspx', form, { headers,httpsAgent:new https.Agent({secureOptions:crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT })  })
        if (isRedirected(res)) throw 'Error'
        return cookie
    } catch (error) {
        spinner.error({ text: chalk.redBright('invalid Crendentials') })
        console.error(error)
        process.exit(1)
    }
}

export default login
