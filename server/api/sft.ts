import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const sftData = JSON.parse(await readFile(resolve('data/sft.json'), 'utf8'))
      return sftData
    } catch (error) {
      console.error('Error reading SFT data:', error)
      throw createError({ statusCode: 500, message: 'Internal Server Error' })
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event)
      await writeFile(resolve('data/sft.json'), JSON.stringify(body, null, 2))
      return { message: 'SFT data updated successfully' }
    } catch (error) {
      console.error('Error updating SFT data:', error)
      throw createError({ statusCode: 500, message: 'Internal Server Error' })
    }
  } else {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' })
  }
})