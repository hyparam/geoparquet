import { parquetMetadataAsync, parquetQuery } from 'hyparquet'
import { decodeWKB } from './wkb.js'

/**
 * Convert a GeoParquet file to GeoJSON.
 * Input is an AsyncBuffer representing a GeoParquet file.
 * An AsyncBuffer is a buffer-like object that can be read asynchronously.
 *
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { Feature, GeoJSON } from './geojson.js'
 * @param {Object} options
 * @param {AsyncBuffer} options.file
 * @returns {Promise<GeoJSON>}
 */
export async function toGeoJson({ file }) {
  const metadata = await parquetMetadataAsync(file)
  const geoMetadata = metadata.key_value_metadata?.find(kv => kv.key === 'geo')
  if (!geoMetadata) {
    throw new Error('Invalid GeoParquet file: missing "geo" metadata')
  }

  // Geoparquet metadata
  const geoSchema = JSON.parse(geoMetadata.value || '{}')

  // Read all parquet data
  const data = await parquetQuery({ file, utf8: false })

  /** @type {Feature[]} */
  const features = []
  const primaryColumn = geoSchema.primary_column || 'geometry'
  for (const row of data) {
    const wkb = row[primaryColumn]
    if (!wkb) {
      // No geometry
      continue
    }

    const geometry = decodeWKB(wkb)

    // Extract properties (all fields except geometry)
    /** @type {Record<string, any>} */
    const properties = {}
    for (const key of Object.keys(row)) {
      let value = row[key]
      if (key !== primaryColumn && value !== null) {
        try {
          // Try to parse JSON
          value = JSON.parse(value)
        } catch (error) {
          // Ignore
        }
        properties[key] = value
      }
    }

    /** @type {Feature} */
    const feature = {
      type: 'Feature',
      geometry,
      properties,
    }

    features.push(feature)
  }

  return {
    type: 'FeatureCollection',
    features,
  }
}
