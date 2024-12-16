import { readGeoParquet } from 'https://unpkg.com/@geoparquet/geoparquet/dist/index.module.js'

let map

/**
 * Initialize the Google Map and load GeoParquet data.
 * This function is called when the Google Maps script has loaded.
 */
window.initMap = async function initMap() {
  // Create a new map centered on a default location (e.g., New York City)
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 5,
  })

  // URL or path to your GeoParquet file
  const parquetUrl = 'data/example.parquet'

  try {
    // Read the GeoParquet file
    const geoParquet = await readGeoParquet(parquetUrl)

    // Convert the parquet data to GeoJSON
    const geoJson = geoParquet.toGeoJSON()

    // Add the GeoJSON data to the map
    map.data.addGeoJson(geoJson)

    // Optionally, fit the map bounds to the loaded data
    fitMapToGeoJson(geoJson)
  } catch (error) {
    console.error('Error loading or parsing GeoParquet file:', error)
  }
}
