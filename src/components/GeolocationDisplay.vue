<template>
  <div class="geolocation-container">
    <h2>Geolocation & Map</h2>
    
    <div class="controls">
      <button @click="getCurrentLocation" :disabled="loading" class="location-btn">
        {{ loading ? 'Getting Location...' : 'Get Current Location' }}
      </button>
      <button @click="clearLocation" :disabled="!hasLocation" class="clear-btn">
        Clear Location
      </button>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="hasLocation" class="location-info">
      <p><strong>Latitude:</strong> {{ location.lat.toFixed(6) }}</p>
      <p><strong>Longitude:</strong> {{ location.lng.toFixed(6) }}</p>
      <p><strong>Accuracy:</strong> {{ accuracy ? accuracy.toFixed(0) + 'm' : 'Unknown' }}</p>
    </div>

    <div v-if="hasLocation" class="map-container">
      <l-map
        v-model:zoom="zoom"
        :center="[location.lat, location.lng]"
        :use-global-leaflet="false"
        class="map"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        ></l-tile-layer>
        <l-marker :lat-lng="[location.lat, location.lng]">
          <l-popup>
            <div>
              <strong>Your Location</strong><br>
              Lat: {{ location.lat.toFixed(6) }}<br>
              Lng: {{ location.lng.toFixed(6) }}
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <div v-if="!hasLocation && !loading && !error" class="no-location">
      <p>Click "Get Current Location" to see your position on the map</p>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'

export default {
  name: 'GeolocationDisplay',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data() {
    return {
      location: {
        lat: 0,
        lng: 0
      },
      accuracy: null,
      zoom: 15,
      loading: false,
      error: null,
      hasLocation: false
    }
  },
  methods: {
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by this browser.'
        return
      }

      this.loading = true
      this.error = null

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

      navigator.geolocation.getCurrentPosition(
        this.onLocationSuccess,
        this.onLocationError,
        options
      )
    },

    onLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.accuracy = position.coords.accuracy
      this.hasLocation = true
      this.loading = false
      this.error = null
      
      // Adjust zoom based on accuracy
      if (this.accuracy > 1000) {
        this.zoom = 12
      } else if (this.accuracy > 100) {
        this.zoom = 15
      } else {
        this.zoom = 17
      }
    },

    onLocationError(error) {
      this.loading = false
      this.hasLocation = false
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.error = 'Location access denied by user. Please enable location permissions.'
          break
        case error.POSITION_UNAVAILABLE:
          this.error = 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          this.error = 'Location request timed out. Please try again.'
          break
        default:
          this.error = 'An unknown error occurred while retrieving location.'
          break
      }
    },

    clearLocation() {
      this.hasLocation = false
      this.location = { lat: 0, lng: 0 }
      this.accuracy = null
      this.error = null
    }
  }
}
</script>

<style scoped>
.geolocation-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.location-btn, .clear-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.location-btn {
  background-color: #4CAF50;
  color: white;
}

.location-btn:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
}

.location-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.clear-btn {
  background-color: #f44336;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-1px);
}

.clear-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.error {
  background-color: #ffebee;
  border: 1px solid #f44336;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.location-info {
  background-color: #e8f5e8;
  border: 1px solid #4CAF50;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.location-info p {
  margin: 5px 0;
  font-family: 'Courier New', monospace;
}

.map-container {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.map {
  height: 400px;
  width: 100%;
}

.no-location {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 2px dashed #ddd;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .geolocation-container {
    padding: 15px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .location-btn, .clear-btn {
    width: 100%;
  }
  
  .map {
    height: 300px;
  }
}
</style>