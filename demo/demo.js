import { asyncBufferFromUrl } from 'hyparquet'
import { toGeoJson } from '../src/index.js'

async function initMap() {
  // @ts-expect-error MapsLibrary
  const { Map } = await google.maps.importLibrary('maps')
  const div = /** @type {HTMLElement} */(document.getElementById('map'))
  // Create a new map
  const map = new Map(div, {
    center: { lat: 39, lng: -98 },
    zoom: 4,
  })

  // URL or path to your GeoParquet file
  const parquetUrl = 'https://hyparam.github.io/geoparquet/demo/polys.parquet'

  try {
    // Read the GeoParquet file and convert to GeoJSON
    const file = await asyncBufferFromUrl({ url: parquetUrl, byteLength: 29838 })
    console.log('GeoParquet file:', file)
    const geojson = await toGeoJson({ file })

    console.log('GeoJSON:', geojson)

    // Add the GeoJSON data to the map
    map.data.addGeoJson(geojson)
  } catch (error) {
    console.error('Error loading or parsing GeoParquet file:', error)
  }
}
initMap()
