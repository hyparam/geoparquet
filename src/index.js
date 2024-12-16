import { parquetMetadataAsync, parquetQuery } from 'hyparquet'

/**
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { GeoJSON } from './geojson.js'
 * @param {AsyncBuffer} asyncBuffer 
 * @returns {Promise<GeoJSON>}
 */
export async function geoparquet2geojson(asyncBuffer) {
  const metadata = await parquetMetadataAsync(asyncBuffer)
  const geoMetadata = metadata.key_value_metadata?.find(kv => kv.key === 'geo')
  if (!geoMetadata) {
    throw new Error('Invalid GeoParquet file: missing "geo" metadata')
  }
  const geoSchema = JSON.parse(geoMetadata.value || '{}')
  console.log('Geoparquet schema:', geoSchema)

  // Read all parquet data
  const data = await parquetQuery({ file: asyncBuffer })
  console.log('Geoparquet data:', data)

  return {
    type: 'FeatureCollection',
    features: [],
  }
}
