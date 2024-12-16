import { parquetMetadataAsync } from 'hyparquet'

/**
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { GeoJSON } from './geojson.js'
 * @param {AsyncBuffer} asyncBuffer 
 * @returns {Promise<GeoJSON>}
 */
export async function geoparquet2geojson(asyncBuffer) {
  const metadata = await parquetMetadataAsync(asyncBuffer)
  const geoMetadata = metadata.key_value_metadata?.find(kv => kv.key === 'geo')
  console.log('Geoparquet metadata:', geoMetadata)

  return {
    type: 'FeatureCollection',
    features: [],
  }
}
