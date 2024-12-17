import { asyncBufferFromUrl } from 'hyparquet'
import { toGeoJson } from '../src/index.js'

let map

// @ts-expect-error need global function for google maps
window.initMap = async function loadGeoParquet() {
  const div = /** @type {HTMLElement} */(document.getElementById('map'))
  // Create a new map
  map = new google.maps.Map(div, {
    center: { lat: 39, lng: -98 },
    zoom: 4,
  })

  // URL or path to your GeoParquet file
  const parquetUrl = 'examples/polys.parquet'

  try {
    // Read the GeoParquet file and convert to GeoJSON
    const file = await asyncBufferFromUrl({ url: parquetUrl })
    const geojson = await toGeoJson({ file })

    console.log('GeoJSON:', geojson)

    // Add the GeoJSON data to the map
    map.data.addGeoJson(geojson)
  } catch (error) {
    console.error('Error loading or parsing GeoParquet file:', error)
  }
}
