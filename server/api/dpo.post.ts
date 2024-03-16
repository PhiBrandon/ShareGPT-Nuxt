import fs from 'fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const dataDir = path.join(process.cwd(), 'data')
  const dpoFilePath = path.join(dataDir, 'dpo.json')

  try {
    await fs.mkdir(dataDir, { recursive: true })

    let dpoData = []
    try {
      dpoData = JSON.parse(await fs.readFile(dpoFilePath, 'utf8'))
    } catch (error) {
      // Ignore error if file doesn't exist
    }

    const newEntry = {
      id: Date.now().toString(),
      ...body
    }

    dpoData.push(newEntry)

    await fs.writeFile(dpoFilePath, JSON.stringify(dpoData, null, 2))

    return { message: 'DPO form submitted successfully' }
  } catch (error) {
    console.error('Error writing DPO data:', error)
    throw createError({ statusCode: 500, message: 'Internal Server Error' })
  }
})