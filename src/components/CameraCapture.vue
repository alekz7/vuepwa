<template>
  <div class="camera-container">
    <h2>Camera Capture</h2>
    
    <div class="controls">
      <button @click="startCamera" :disabled="isStreaming" class="start-btn">
        {{ isStreaming ? 'Camera Active' : 'Start Camera' }}
      </button>
      <button @click="stopCamera" :disabled="!isStreaming" class="stop-btn">
        Stop Camera
      </button>
      <button @click="capturePhoto" :disabled="!isStreaming" class="capture-btn">
        📸 Capture Photo
      </button>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div class="camera-section">
      <div v-if="isStreaming" class="video-container">
        <video
          ref="videoElement"
          autoplay
          playsinline
          muted
          class="video-stream"
        ></video>
        <canvas
          ref="canvasElement"
          class="capture-canvas"
          style="display: none;"
        ></canvas>
      </div>

      <div v-if="!isStreaming && !error" class="no-camera">
        <p>Click "Start Camera" to begin video capture</p>
        <p class="note">Camera access requires user permission</p>
      </div>
    </div>

    <div v-if="capturedPhotos.length > 0" class="photos-section">
      <h3>Captured Photos ({{ capturedPhotos.length }})</h3>
      <div class="photos-grid">
        <div
          v-for="(photo, index) in capturedPhotos"
          :key="index"
          class="photo-item"
        >
          <img :src="photo.dataUrl" :alt="`Captured photo ${index + 1}`" class="captured-photo" />
          <div class="photo-info">
            <p class="photo-timestamp">{{ photo.timestamp }}</p>
            <div class="photo-actions">
              <button @click="downloadPhoto(photo, index)" class="download-btn">
                💾 Download
              </button>
              <button @click="deletePhoto(index)" class="delete-btn">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="photos-controls">
        <button @click="clearAllPhotos" class="clear-all-btn">
          Clear All Photos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CameraCapture',
  data() {
    return {
      isStreaming: false,
      error: null,
      stream: null,
      capturedPhotos: []
    }
  },
  methods: {
    async startCamera() {
      try {
        this.error = null
        
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          this.error = 'Camera access is not supported in this browser.'
          return
        }

        // Request camera access
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user' // Front camera by default
          }
        }

        this.stream = await navigator.mediaDevices.getUserMedia(constraints)
        
        // Set up video element
        const video = this.$refs.videoElement
        video.srcObject = this.stream
        
        video.onloadedmetadata = () => {
          this.isStreaming = true
          // Set up canvas dimensions to match video
          const canvas = this.$refs.canvasElement
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

      } catch (error) {
        this.handleCameraError(error)
      }
    },

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }
      
      if (this.$refs.videoElement) {
        this.$refs.videoElement.srcObject = null
      }
      
      this.isStreaming = false
    },

    capturePhoto() {
      if (!this.isStreaming) return

      const video = this.$refs.videoElement
      const canvas = this.$refs.canvasElement
      const context = canvas.getContext('2d')

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      
      // Create photo object
      const photo = {
        dataUrl,
        timestamp: new Date().toLocaleString(),
        width: canvas.width,
        height: canvas.height
      }

      // Add to captured photos array
      this.capturedPhotos.unshift(photo) // Add to beginning of array
      
      // Limit to 10 photos to prevent memory issues
      if (this.capturedPhotos.length > 10) {
        this.capturedPhotos = this.capturedPhotos.slice(0, 10)
      }
    },

    downloadPhoto(photo, index) {
      const link = document.createElement('a')
      link.download = `captured-photo-${index + 1}-${Date.now()}.jpg`
      link.href = photo.dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    deletePhoto(index) {
      this.capturedPhotos.splice(index, 1)
    },

    clearAllPhotos() {
      this.capturedPhotos = []
    },

    handleCameraError(error) {
      console.error('Camera error:', error)
      
      switch (error.name) {
        case 'NotAllowedError':
          this.error = 'Camera access denied. Please enable camera permissions and try again.'
          break
        case 'NotFoundError':
          this.error = 'No camera found on this device.'
          break
        case 'NotSupportedError':
          this.error = 'Camera access is not supported in this browser.'
          break
        case 'NotReadableError':
          this.error = 'Camera is already in use by another application.'
          break
        default:
          this.error = `Camera error: ${error.message}`
          break
      }
    }
  },

  beforeUnmount() {
    this.stopCamera()
  }
}
</script>

<style scoped>
.camera-container {
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

.start-btn, .stop-btn, .capture-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.start-btn {
  background-color: #4CAF50;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
}

.stop-btn {
  background-color: #f44336;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-1px);
}

.capture-btn {
  background-color: #2196F3;
  color: white;
}

.capture-btn:hover:not(:disabled) {
  background-color: #1976D2;
  transform: translateY(-1px);
}

.start-btn:disabled, .stop-btn:disabled, .capture-btn:disabled {
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

.camera-section {
  margin-bottom: 30px;
}

.video-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-stream {
  width: 100%;
  height: auto;
  display: block;
}

.no-camera {
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

.photos-section {
  margin-top: 30px;
}

.photos-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.photo-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.photo-item:hover {
  transform: translateY(-2px);
}

.captured-photo {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.photo-info {
  padding: 15px;
}

.photo-timestamp {
  font-size: 12px;
  color: #666;
  margin: 0 0 10px 0;
}

.photo-actions {
  display: flex;
  gap: 8px;
}

.download-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.download-btn {
  background-color: #4CAF50;
  color: white;
}

.download-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #da190b;
}

.photos-controls {
  text-align: center;
}

.clear-all-btn {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.clear-all-btn:hover {
  background-color: #f57c00;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .camera-container {
    padding: 15px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .start-btn, .stop-btn, .capture-btn {
    width: 100%;
  }
  
  .photos-grid {
    grid-template-columns: 1fr;
  }
}
</style>