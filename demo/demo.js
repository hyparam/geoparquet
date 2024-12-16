import { asyncBufferFromUrl } from 'https://unpkg.com/hyparquet'
import { geoparquet2geojson } from '../src/index.js'

const googleMapsKey = 'AIzaSyBQSLAwuvTBUrsDpwe17SFdIHo4PJXE1-Q'
let map

async function loadGeoParquet() {
  // Create a new map centered on a default location
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

/**
 * Dynamically load the Google Maps JavaScript API.
 * @returns {Promise<void>} Resolves when the API has loaded.
 */
function loadGoogleMapsApi() {
  return new Promise((resolve, reject) => {
    // The callback the Maps API will invoke
    window.initMap = () => {
      resolve()
    }
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&callback=initMap`
    script.async = true
    script.onerror = () => reject(new Error('Google Maps script failed to load'))
    document.head.appendChild(script)
  });
}

// Initialize
async function initialize() {
  await loadGoogleMapsApi()
  await loadGeoParquet()
}
initialize()
