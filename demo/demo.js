// import { asyncBufferFromUrl } from 'https://unpkg.com/hyparquet'
import { geoparquet2geojson } from '../src/index.js'

let map

/**
 * Initialize the Google Map and load GeoParquet data.
 * This function is called when the Google Maps script has loaded.
 */
window.initMap = async function initMap() {
  // Create a new map centered on a default location (e.g., New York City)
  const div = document.getElementById('map')
  map = new google.maps.Map(div, {
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 5,
  })

  // URL or path to your GeoParquet file
  const parquetUrl = 'examples/example.geo.parquet'

  try {
    // Read the GeoParquet file and convert to GeoJSON
    const asyncBuffer = await asyncBufferFromUrl({ url: parquetUrl })
    const geojson = await geoparquet2geojson(asyncBuffer)

    // Add the GeoJSON data to the map
    map.data.addGeoJson(geojson)
  } catch (error) {
    console.error('Error loading or parsing GeoParquet file:', error)
  }
}
