import { initDb } from '../utils/init-db'

export default defineNitroPlugin(() => {
  initDb()
})
