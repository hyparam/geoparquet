
const geometryTypePoint = 1
const geometryTypeLineString = 2
const geometryTypePolygon = 3
const geometryTypeMultiPoint = 4
const geometryTypeMultiLineString = 5
const geometryTypeMultiPolygon = 6

/**
 * Minimal WKB (Well Known Binary) decoder supporting Polygon and MultiPolygon.
 * Supports both big-endian (byteOrder=0) and little-endian (byteOrder=1).
 * @import { Geometry } from './geojson.js'
 * @param {Uint8Array} wkb 
 * @returns {Geometry} GeoJSON geometry object
 */
export function decodeWKB(wkb) {
  let offset = 0

  // Byte order: 0 = big-endian, 1 = little-endian
  const byteOrder = wkb[offset]; offset += 1
  const isLittleEndian = (byteOrder === 1)

  // Helper functions
  /**
   * Read a 32-bit unsigned integer from buffer at given offset
   * @param {Uint8Array} buf
   * @param {number} off
   */
  function readUInt32(buf, off) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
    return dv.getUint32(off, isLittleEndian)
  }

  /**
   * Read a 64-bit double from buffer at given offset
   * @param {Uint8Array} buf
   * @param {number} off
   */
  function readDouble(buf, off) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
    return dv.getFloat64(off, isLittleEndian)
  }

  // Read geometry type
  const geometryType = readUInt32(wkb, offset)
  offset += 4

  // WKB geometry types (OGC):
  if (geometryType === geometryTypePoint) {
    // Point
    const x = readDouble(wkb, offset); offset += 8
    const y = readDouble(wkb, offset); offset += 8
    return { type: 'Point', coordinates: [x,y] }
  } else if (geometryType === geometryTypeLineString) {
    // LineString
    const numPoints = readUInt32(wkb, offset); offset += 4
    const coords = []
    for (let i = 0; i < numPoints; i++) {
      const x = readDouble(wkb, offset); offset += 8
      const y = readDouble(wkb, offset); offset += 8
      coords.push([x,y])
    }
    return { type: 'LineString', coordinates: coords }
  } else if (geometryType === geometryTypePolygon) {
    // Polygon
    const numRings = readUInt32(wkb, offset); offset += 4
    const coords = []
    for (let r = 0; r < numRings; r++) {
      const numPoints = readUInt32(wkb, offset); offset += 4
      const ring = []
      for (let p = 0; p < numPoints; p++) {
        const x = readDouble(wkb, offset); offset += 8
        const y = readDouble(wkb, offset); offset += 8
        ring.push([x,y])
      }
      coords.push(ring)
    }
    return { type: 'Polygon', coordinates: coords }

  } else if (geometryType === geometryTypeMultiPolygon) {
    // MultiPolygon
    const numPolygons = readUInt32(wkb, offset); offset += 4
    const polygons = []
    for (let i = 0; i < numPolygons; i++) {
      // Each polygon has its own byte order & geometry type
      const pgByteOrder = wkb[offset]; offset += 1
      const pgIsLittleEndian = (pgByteOrder === 1)
      const pgType = (function() {
        const dv = new DataView(wkb.buffer, wkb.byteOffset, wkb.byteLength)
        const val = dv.getUint32(offset, pgIsLittleEndian)
        offset += 4
        return val
      })()

      if (pgType !== 3) throw new Error(`Expected Polygon in MultiPolygon, got ${pgType}`)

      const numRings = (function() {
        const dv = new DataView(wkb.buffer, wkb.byteOffset, wkb.byteLength)
        const val = dv.getUint32(offset, pgIsLittleEndian)
        offset += 4
        return val
      })()

      const pgCoords = []
      for (let r = 0; r < numRings; r++) {
        const numPoints = (function() {
          const dv = new DataView(wkb.buffer, wkb.byteOffset, wkb.byteLength)
          const val = dv.getUint32(offset, pgIsLittleEndian)
          offset += 4
          return val
        })()
        const ring = []
        for (let p = 0; p < numPoints; p++) {
          const dv = new DataView(wkb.buffer, wkb.byteOffset, wkb.byteLength)
          const x = dv.getFloat64(offset, pgIsLittleEndian); offset += 8
          const y = dv.getFloat64(offset, pgIsLittleEndian); offset += 8
          ring.push([x,y])
        }
        pgCoords.push(ring)
      }
      polygons.push(pgCoords)
    }
    return { type: 'MultiPolygon', coordinates: polygons }
  } else {
    throw new Error("Unsupported geometry type: " + geometryType)
  }
}
