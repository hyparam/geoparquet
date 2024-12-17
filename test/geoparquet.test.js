import { asyncBufferFromFile } from 'hyparquet'
import { describe, expect, it } from 'vitest'
import { toGeoJson } from '../src/index.js'
import example from '../examples/example.json' with { type: 'json' }
import polys from '../examples/polys.json' with { type: 'json' }

describe('geoparquet', () => {
  it('should parse example.parquet', async () => {
    const asyncBuffer = await asyncBufferFromFile('examples/example.parquet')
    const geojson = await toGeoJson(asyncBuffer)
    expect(geojson).toEqual(example)
  })

  it('should parse polys.parquet', async () => {
    const asyncBuffer = await asyncBufferFromFile('examples/polys.parquet')
    const geojson = await toGeoJson(asyncBuffer)
    expect(geojson).toEqual(polys)
  })
})
