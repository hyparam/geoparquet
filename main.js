// Initialize the Google Map instance
let map

async function initMap() {
  // Create the map centered on a default location (e.g., the US)
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 39.8283, lng: -98.5795 }, // Center of the continental US
    zoom: 4,
  })

  // Once the map is initialized, load and plot GeoParquet data
  await loadAndPlotGeoParquet()
}

async function loadAndPlotGeoParquet() {
  const statusDiv = document.getElementById('status')
  statusDiv.textContent = 'Loading parquet data...'

  try {
    // Import hyparquet library
    const { asyncBufferFromUrl, parquetRead } = await import('https://cdn.jsdelivr.net/npm/hyparquet/src/hyparquet.min.js')

    // Replace with your GeoParquet file URL
    const url = 'https://example.com/path/to/your-geoparquet-file.parquet'

    // Specify the columns to read
    const columns = ['geometry', 'name'] // Example: geometry + a name field

    // Read data from the GeoParquet file
    const dataBuffer = await asyncBufferFromUrl({ url })
    const data = await parquetRead({
      file: dataBuffer,
      columns,
    })

    statusDiv.textContent = 'Processing data...'

    // Extract geometries and names
    const geometries = data.geometry
    const names = data.name || []

    // Add markers for each geometry
    let bounds = new google.maps.LatLngBounds()
    for (let i = 0; i < geometries.length; i++) {
      const geom = geometries[i];
      if (geom && geom.type === 'Point' && Array.isArray(geom.coordinates)) {
        const [lng, lat] = geom.coordinates
        const position = { lat, lng }

        new google.maps.Marker({
          position,
          map,
          title: names[i] || 'No Name',
        })

        // Extend the bounds to include this marker
        bounds.extend(position)
      }
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds)
    }

    statusDiv.textContent = 'Data loaded!'
    setTimeout(() => { statusDiv.style.display = 'none'; }, 2000)

  } catch (error) {
    console.error('Error loading or plotting data:', error)
    statusDiv.textContent = 'Error loading data. Check console for details.'
  }
}

// Expose `initMap` globally for the Google Maps callback
window.initMap = initMap
