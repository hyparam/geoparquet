# GeoParquet

![GeoParquet](geoparquet.jpg)

[![npm](https://img.shields.io/npm/v/hyparquet)](https://www.npmjs.com/package/hyparquet)
[![minzipped](https://img.shields.io/bundlephobia/minzip/hyparquet)](https://www.npmjs.com/package/hyparquet)
[![workflow status](https://github.com/hyparam/geoparquet/actions/workflows/ci.yml/badge.svg)](https://github.com/hyparam/geoparquet/actions)
[![mit license](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
![coverage](https://img.shields.io/badge/Coverage-95-darkred)

**GeoParquet** provides a pure JavaScript workflow to read and convert [GeoParquet](https://github.com/opengeospatial/geoparquet) files into [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946). Under the hood, it uses the [hyparquet](https://github.com/hyparam/hyparquet) library for efficient in-browser parquet parsing, enabling minimal overhead and fast loading.

## Why GeoParquet?

**GeoParquet** is an emerging standard for storing geospatial vector data in the columnar [Parquet](https://parquet.apache.org/) format. By leveraging Parquet’s columnar storage, GeoParquet files can be significantly more compact and faster to query than their GeoJSON equivalents, especially for large datasets. This can result in:

- **Smaller file sizes:** A GeoParquet file plus this lightweight library can often be much smaller than the equivalent GeoJSON, reducing bandwidth costs and improving load times.
- **Faster loading:** Pure JavaScript parsing of Parquet files in the browser, with tiny package size means fast page load times.
- **Seamless integration:** GeoParquet is based on well-established standards (GeoJSON, Parquet), ensuring broad compatibility and extensibility.

## Usage

Convert a GeoParquet file to GeoJSON:

```javascript
const { asyncBufferFromUrl, toGeoJson } = import('geoparquet')

const file = asyncBufferFromUrl('example.parquet')
const geoJson = toGeoJson({ file })
```

## Demo

Check out the [live demo](https://hyparam.github.io/geoparquet/) to see GeoParquet in action.

## References

 - https://geoparquet.org/
 - https://github.com/opengeospatial/geoparquet
 - https://geojson.org/
 - https://datatracker.ietf.org/doc/html/rfc7946
 - https://github.com/hyparam/hyparquet
