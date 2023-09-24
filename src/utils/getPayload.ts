import axios from 'axios'
import * as cheerio from 'cheerio'
const getPayload = async () => {
    const res = await axios.get('https://ums.paruluniversity.ac.in/Login.aspx').catch((x) => x)
    const cookie = res.headers['set-cookie'][0].split('=')[1].split(';')[0] || ''
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
