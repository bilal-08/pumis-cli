import { join, dirname } from 'node:path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'node:url'
type UserSession = {
    username: string
    cookie: string
    timestamp: number
}
type data = {
    users: UserSession[]
}
export class dbhandler {
    DB!: Low<data>

    async startDb() {
        const __dirname = dirname(fileURLToPath(import.meta.url))
        const file = join(__dirname, '..', '..', 'session.json')

        const adapter = new JSONFile<data>(file)
        const defaultData: data = { users: [] }
        const db = new Low<data>(adapter, defaultData)
        this.DB = db
    }
    async getUser(username: string) {
        await this.DB.read()
        const data = this.DB.data.users || []
        return data
            .map((user, i) => {
                if (user.username == username) return { user, i }
            })
            .filter((x) => x)
    }
    async saveUser(username: string, cookie: string, isValid: boolean | number) {
        await this.DB.read()
        const data = await this.getUser(username)
        if (data.length >= 1 && !isValid) {
            console.log(data.length > 1, !isValid)
            const { users } = this.DB.data
            users[data[0]?.i || 0].cookie = cookie
            users[data[0]?.i || 0].timestamp = Date.now()
            this.DB.data = { users }
            return await this.DB.write()
        }
        this.DB.data.users.push({ username, cookie, timestamp: Date.now() })
        await this.DB.write()
    }
}
