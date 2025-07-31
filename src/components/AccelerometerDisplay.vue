<template>
  <div class="accelerometer-container">
    <h2>Device Motion & Accelerometer</h2>
    
    <div class="controls">
      <button @click="startMotionTracking" :disabled="isTracking" class="start-btn">
        {{ isTracking ? 'Tracking Motion...' : 'Start Motion Tracking' }}
      </button>
      <button @click="stopMotionTracking" :disabled="!isTracking" class="stop-btn">
        Stop Tracking
      </button>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="permissionStatus" class="permission-status">
      <p><strong>Motion Permission:</strong> {{ permissionStatus }}</p>
    </div>

    <div v-if="isTracking && motionData" class="motion-data">
      <div class="data-section">
        <h3>Acceleration (m/s²)</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="label">X:</span>
            <span class="value">{{ motionData.acceleration?.x?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Y:</span>
            <span class="value">{{ motionData.acceleration?.y?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Z:</span>
            <span class="value">{{ motionData.acceleration?.z?.toFixed(2) || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Acceleration + Gravity (m/s²)</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="label">X:</span>
            <span class="value">{{ motionData.accelerationIncludingGravity?.x?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Y:</span>
            <span class="value">{{ motionData.accelerationIncludingGravity?.y?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Z:</span>
            <span class="value">{{ motionData.accelerationIncludingGravity?.z?.toFixed(2) || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Rotation Rate (°/s)</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="label">Alpha:</span>
            <span class="value">{{ motionData.rotationRate?.alpha?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Beta:</span>
            <span class="value">{{ motionData.rotationRate?.beta?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="data-item">
            <span class="label">Gamma:</span>
            <span class="value">{{ motionData.rotationRate?.gamma?.toFixed(2) || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Motion Intensity</h3>
        <div class="intensity-bar">
          <div class="intensity-fill" :style="{ width: intensityPercentage + '%' }"></div>
        </div>
        <p class="intensity-value">{{ intensity.toFixed(2) }} m/s²</p>
      </div>
    </div>

    <div v-if="!isTracking && !error" class="no-data">
      <p>Click "Start Motion Tracking" to see device motion data</p>
      <p class="note">Note: This feature works best on mobile devices</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccelerometerDisplay',
  data() {
    return {
      isTracking: false,
      motionData: null,
      error: null,
      permissionStatus: null,
      intensity: 0
    }
  },
  computed: {
    intensityPercentage() {
      // Cap intensity at 20 m/s² for visualization
      return Math.min((this.intensity / 20) * 100, 100)
    }
  },
  methods: {
    async startMotionTracking() {
      try {
        this.error = null
        
        // Check if DeviceMotionEvent is supported
        if (!window.DeviceMotionEvent) {
          this.error = 'Device motion is not supported on this device/browser.'
          return
        }

        // For iOS 13+ devices, request permission
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          const permission = await DeviceMotionEvent.requestPermission()
          this.permissionStatus = permission
          
          if (permission !== 'granted') {
            this.error = 'Motion permission denied. Please enable motion access in your browser settings.'
            return
          }
        } else {
          this.permissionStatus = 'granted (no permission required)'
        }

        this.isTracking = true
        window.addEventListener('devicemotion', this.handleMotionEvent)
        
      } catch (error) {
        this.error = `Error starting motion tracking: ${error.message}`
        this.isTracking = false
      }
    },

    stopMotionTracking() {
      this.isTracking = false
      window.removeEventListener('devicemotion', this.handleMotionEvent)
      this.motionData = null
      this.intensity = 0
    },

    handleMotionEvent(event) {
      this.motionData = {
        acceleration: event.acceleration,
        accelerationIncludingGravity: event.accelerationIncludingGravity,
        rotationRate: event.rotationRate,
        interval: event.interval
      }

      // Calculate motion intensity
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity
        this.intensity = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2)
      }
    }
  },

  beforeUnmount() {
    if (this.isTracking) {
      this.stopMotionTracking()
    }
  }
}
</script>

<style scoped>
.accelerometer-container {
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

.start-btn, .stop-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.start-btn {
  background-color: #2196F3;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #1976D2;
  transform: translateY(-1px);
}

.start-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.stop-btn {
  background-color: #f44336;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-1px);
}

.stop-btn:disabled {
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

.permission-status {
  background-color: #e3f2fd;
  border: 1px solid #2196F3;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.motion-data {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.data-section {
  margin-bottom: 25px;
}

.data-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.data-item {
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #2196F3;
}

.intensity-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.intensity-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #FFC107, #f44336);
  transition: width 0.1s ease;
}

.intensity-value {
  text-align: center;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 2px dashed #ddd;
}

.note {
  font-size: 14px;
  color: #999;
  font-style: italic;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .accelerometer-container {
    padding: 15px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .start-btn, .stop-btn {
    width: 100%;
  }
  
  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>