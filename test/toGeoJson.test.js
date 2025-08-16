import fs from 'fs'
import { asyncBufferFromFile, toJson } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'
import { describe, expect, it } from 'vitest'
import { toGeoJson } from '../src/index.js'

describe('toGeoJson parse test files', () => {
  const files = fs.readdirSync('test/files').filter(f => f.endsWith('.parquet'))

  files.forEach(filename => {
    it(`parse data from ${filename}`, async () => {
      const base = filename.replace('.parquet', '')
      const file = await asyncBufferFromFile(`test/files/${filename}`)
      const geojson = await toGeoJson({ file })
      const expected = fileToJson(`test/files/${base}.json`)
      expect(toJson(geojson)).toEqual(expected)
    })
  })

  // Parse compressed parquet files
  const compressedFiles = fs.readdirSync('test/files/compressed')
  compressedFiles.forEach(filename => {
    it(`parse data from compressed ${filename}`, async () => {
      const file = await asyncBufferFromFile(`test/files/compressed/${filename}`)
      const geojson = await toGeoJson({ file, compressors })
      const expected = fileToJson('test/files/compressed-example.json')
      expect(toJson(geojson)).toEqual(expected)
    })
  })
})

/**
 * @param {string} filePath
 * @returns {any}
 */
function fileToJson(filePath) {
  const buffer = fs.readFileSync(filePath)
  return JSON.parse(buffer.toString())
}
