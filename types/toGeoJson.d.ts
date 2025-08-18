/**
 * Convert a GeoParquet file to GeoJSON.
 * Input is an AsyncBuffer representing a GeoParquet file.
 * An AsyncBuffer is a buffer-like object that can be read asynchronously.
 *
 * @import { AsyncBuffer, Compressors } from 'hyparquet'
 * @import { Feature, GeoJSON } from './geojson.js'
 * @param {Object} options
 * @param {AsyncBuffer} options.file
 * @param {Compressors} [options.compressors]
 * @returns {Promise<GeoJSON>}
 */
export function toGeoJson({ file, compressors }: {
    file: AsyncBuffer;
    compressors?: import("hyparquet/src/types.js").Compressors | undefined;
}): Promise<GeoJSON>;
import type { AsyncBuffer } from 'hyparquet';
import type { GeoJSON } from './geojson.js';
//# sourceMappingURL=toGeoJson.d.ts.map