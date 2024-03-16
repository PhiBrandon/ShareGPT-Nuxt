import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const dpoData = JSON.parse(await readFile(resolve('data/dpo.json'), 'utf8'))
      return dpoData
    } catch (error) {
      console.error('Error reading DPO data:', error)
      throw createError({ statusCode: 500, message: 'Internal Server Error' })
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event)
      await writeFile(resolve('data/dpo.json'), JSON.stringify(body, null, 2))
      return { message: 'DPO data updated successfully' }
    } catch (error) {
      console.error('Error updating DPO data:', error)
      throw createError({ statusCode: 500, message: 'Internal Server Error' })
    }
  } else {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' })
  }
})