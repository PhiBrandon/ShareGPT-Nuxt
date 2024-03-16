import fs from 'fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const dataDir = path.join(process.cwd(), 'data')
  const sftFilePath = path.join(dataDir, 'sft.json')

  try {
    await fs.mkdir(dataDir, { recursive: true })

    let sftData = []
    try {
      sftData = JSON.parse(await fs.readFile(sftFilePath, 'utf8'))
    } catch (error) {
      // Ignore error if file doesn't exist
    }

    const newEntry = {
      id: Date.now().toString(),
      ...body
    }

    sftData.push(newEntry)

    await fs.writeFile(sftFilePath, JSON.stringify(sftData, null, 2))

    return { message: 'SFT form submitted successfully' }
  } catch (error) {
    console.error('Error writing SFT data:', error)
    throw createError({ statusCode: 500, message: 'Internal Server Error' })
  }
})