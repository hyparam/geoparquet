
/**
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { GeoJSON } from './geojson.js'
 * @param {AsyncBuffer} asyncBuffer 
 * @returns {Promise<GeoJSON>}
 */
export async function geoparquet2geojson(asyncBuffer) {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}
