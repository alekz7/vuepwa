<template>
  <div>
    <h1>PWA Mobile Features Demo</h1>
    
    <div class="features-tabs">
      <button 
        @click="activeTab = 'geolocation'" 
        :class="{ active: activeTab === 'geolocation' }"
        class="tab-button"
      >
        📍 Geolocation
      </button>
      <button 
        @click="activeTab = 'camera'" 
        :class="{ active: activeTab === 'camera' }"
        class="tab-button"
      >
        📷 Camera
      </button>
      <button 
        @click="activeTab = 'accelerometer'" 
        :class="{ active: activeTab === 'accelerometer' }"
        class="tab-button"
      >
        📱 Motion
      </button>
    </div>

    <div class="feature-content">
      <GeolocationDisplay v-if="activeTab === 'geolocation'" />
      <CameraCapture v-if="activeTab === 'camera'" />
      <AccelerometerDisplay v-if="activeTab === 'accelerometer'" />
    </div>
  </div>
</template>

<script>
import GeolocationDisplay from "./components/GeolocationDisplay.vue";
import CameraCapture from "./components/CameraCapture.vue";
import AccelerometerDisplay from "./components/AccelerometerDisplay.vue";

export default {
  name: "App",
  components: {
    GeolocationDisplay,
    CameraCapture,
    AccelerometerDisplay,
  },
  data() {
    return {
      activeTab: 'geolocation'
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.features-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 20px;
  border: 2px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
}

.tab-button:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
}

.tab-button.active {
  background-color: #2196F3;
  border-color: #2196F3;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.feature-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .features-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .tab-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
