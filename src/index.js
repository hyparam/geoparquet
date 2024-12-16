import { parquetMetadataAsync, parquetQuery, toJson } from 'hyparquet'

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
  console.log('Geoparquet data:', toJson(data))

  // Convert parquet data to GeoJSON
  /**
   * @import { Feature } from './geojson.js'
   * @type {Feature[]}
   */
  const features = []

  // According to the schema, the primary geometry column is 'geometry'
  // We'll assume WKB encoding, and other columns are properties
  const primaryColumn = geoSchema.primary_column || 'geometry'

  for (const row of data) {
    const wkbStr = row[primaryColumn]
    if (!wkbStr) {
      // No geometry
      continue
    }

    // Convert the UTF-8 string with weird chars back to binary
    // The parquetQuery returns strings. We'll treat as binary data with char codes.
    const binary = new Uint8Array(wkbStr.length)
    for (let i = 0; i < wkbStr.length; i++) {
      binary[i] = wkbStr.charCodeAt(i)
    }

    // const geom2 = wkx.parse(binary.buffer)
    // console.log('WKB:', binary, 'WKX:', geom2)

    const geometry = decodeWKB(binary)

    // Extract properties (all fields except geometry)
    /** @type {Record<string, any>} */
    const properties = {}
    for (const key of Object.keys(row)) {
      if (key !== primaryColumn) {
        properties[key] = row[key]
      }
    }

    /** @type {Feature} */
    const feature = {
      type: 'Feature',
      geometry,
      properties
    }

    features.push(feature)
  }

  return {
    type: 'FeatureCollection',
    features,
  }
}
