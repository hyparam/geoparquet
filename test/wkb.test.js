import { describe, expect, it } from 'vitest'
import { decodeWKB } from '../src/wkb.js'

describe('WKB decoding', () => {
  it('should decoding well-known binary', () => {
    const buffer = new Uint8Array([
      1, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 128, 89, 64, 0, 0, 0,
      0, 0, 0, 224, 63,
    ])
    const json = decodeWKB(buffer)
    const expected = {
      type: 'Point',
      coordinates: [102, 0.5],
    }
    expect(json).toEqual(expected)
  })
})
