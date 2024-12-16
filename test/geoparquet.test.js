import { asyncBufferFromFile } from 'hyparquet'
import { describe, expect, it } from 'vitest'
import { toGeoJson } from '../src/index.js'
import expected from '../examples/example.json' with { type: 'json' }

describe('geoparquet', () => {
  it('should parse example geoparquet file', async () => {
    const asyncBuffer = await asyncBufferFromFile('examples/example.parquet')
    const geojson = await toGeoJson(asyncBuffer)
    expect(geojson).toEqual(expected)
  })
})
