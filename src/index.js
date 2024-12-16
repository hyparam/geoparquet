import { parquetMetadataAsync, parquetQuery, toJson } from 'hyparquet'

/**
 * @import { AsyncBuffer } from 'hyparquet'
 * @import { GeoJSON, Geometry } from './geojson.js'
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
    for (let i=0; i<wkbStr.length; i++) {
      binary[i] = wkbStr.charCodeAt(i)
    }

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

/**
 * Minimal WKB (Well Known Binary) decoder supporting Polygon and MultiPolygon.
 * @param {Uint8Array} wkb 
 * @returns {Geometry} GeoJSON geometry object
 */
function decodeWKB(wkb) {
  /**
   * Helper to read little-endian values
   * @param {Uint8Array} buf
   * @param {number} offset
   */
  const readUInt32LE = (buf, offset) => (
    buf[offset] |
    (buf[offset+1] << 8) |
    (buf[offset+2] << 16) |
    (buf[offset+3] << 24)
  )

  /**
   * read double little-endian
   * @param {Uint8Array} buf
   * @param {number} offset
   */
  const readDoubleLE = (buf, offset) => {
    const bytes = buf.subarray(offset, offset+8)
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    return dv.getFloat64(0, true)
  }

  let offset = 0
  // Byte order
  const byteOrder = wkb[offset]; offset += 1
  // we assume byteOrder = 1 (little-endian) as per provided data
  if (byteOrder !== 1) {
    throw new Error("Big-endian WKB not supported in this example")
  }

  const geometryType = readUInt32LE(wkb, offset); offset += 4

  // WKB geometry types (http://www.opengeospatial.org/standards/sfa):
  // 1=Point, 2=LineString, 3=Polygon, 4=MultiPoint, 5=MultiLineString, 6=MultiPolygon
  // Here we expect Polygon(3) or MultiPolygon(6) based on the example
  if (geometryType === 3) {
    // Polygon: uint32 numRings; for each ring: uint32 numPoints; points[]
    const numRings = readUInt32LE(wkb, offset); offset += 4
    const coords = []
    for (let r = 0; r < numRings; r++) {
      const numPoints = readUInt32LE(wkb, offset); offset += 4
      const ring = []
      for (let p = 0; p < numPoints; p++) {
        const x = readDoubleLE(wkb, offset); offset += 8
        const y = readDoubleLE(wkb, offset); offset += 8
        ring.push([x,y])
      }
      coords.push(ring)
    }
    return { type: 'Polygon', coordinates: coords }
  } else if (geometryType === 6) {
    // MultiPolygon: uint32 numPolygons; then each polygon as Polygon structure
    const numPolygons = readUInt32LE(wkb, offset); offset += 4
    const polygons = []
    for (let i=0; i<numPolygons; i++) {
      // Each polygon is itself a WKB Polygon => read byte order & type again
      const pgByteOrder = wkb[offset]; offset += 1
      if (pgByteOrder !== 1) throw new Error("Big-endian sub-polygon not supported")
      const pgType = readUInt32LE(wkb, offset); offset += 4
      if (pgType !== 3) throw new Error("Expected Polygon in MultiPolygon")
      const numRings = readUInt32LE(wkb, offset); offset += 4
      const pgCoords = []
      for (let r = 0; r < numRings; r++) {
        const numPoints = readUInt32LE(wkb, offset); offset += 4
        const ring = []
        for (let p = 0; p < numPoints; p++) {
          const x = readDoubleLE(wkb, offset); offset += 8
          const y = readDoubleLE(wkb, offset); offset += 8
          ring.push([x,y])
        }
        pgCoords.push(ring)
      }
      polygons.push(pgCoords)
    }
    return { type: 'MultiPolygon', coordinates: polygons }
  } else {
    throw new Error("Unsupported geometry type in this example: " + geometryType)
  }
}
