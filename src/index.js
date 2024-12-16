
/**
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { GeoJSON } from './geojson.js'
 * @param {AsyncBuffer} asyncBuffer 
 * @returns {GeoJSON}
 */
export function geoparquet2geojson(asyncBuffer) {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}
