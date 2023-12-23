import axios from 'axios'
import * as cheerio from 'cheerio'
import crypto from 'crypto'
import https from 'https'
const getPayload = async () => {
    const res = await axios.get('https://ums.paruluniversity.ac.in/Login.aspx',{
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        })
      }).catch(x=>x)
    const cookie = res.headers['set-cookie'][0].split('=')[1].split(';')[0]
    const $ = cheerio.load(res.data)
    const viewState = $('#__VIEWSTATE')?.attr()?.value
    const viewStateGenerator = $('#__VIEWSTATEGENERATOR').attr()?.value
    const viewStateEncrypted = $('#__VIEWSTATEENCRYPTED').attr()?.value
    return {
        viewState,
        viewStateGenerator,
        viewStateEncrypted,
        cookie
    }
}
export default getPayload
