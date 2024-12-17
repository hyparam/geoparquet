import fs from 'fs'
import { asyncBufferFromFile } from 'hyparquet'
import { describe, expect, it } from 'vitest'
import { toGeoJson } from '../src/index.js'
import example from './files/example.json' with { type: 'json' }
import polys from './files/polys.json' with { type: 'json' }

describe('toGeoJson parse test files', () => {
  const files = fs.readdirSync('test/files').filter(f => f.endsWith('.parquet'))

  files.forEach(filename => {
    it(`parse data from ${filename}`, async () => {
      const base = filename.replace('.parquet', '')
      const file = await asyncBufferFromFile(`test/files/${filename}`)
      const geojson = await toGeoJson({ file })
      const expected = fileToJson(`test/files/${base}.json`)
      expect(geojson).toEqual(expected)
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
