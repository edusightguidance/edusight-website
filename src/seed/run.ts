import { getPayload } from 'payload'
import config from '@payload-config'
import { seedAll } from './seed'

getPayload({ config })
  .then((p) => seedAll(p))
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
