<template>
  <div class="my-14 text-center border-gray-300 dark:border-gray-700 ">
    <p
      :class="displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'"
      class="text-lg font-medium"
    >
      Version: {{ appVersion }}
    </p>

    <button
      v-if="!updateAvailable"
      @click="onCheckForUpdate"
      class="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-5 py-2.5 rounded shadow-md"
    >
      Check for Update
    </button>

    <!-- Only show update UI if either manually checked or update is available -->
    <div v-if="showUpdateUI">
      <div v-if="updateAvailable" class="mt-4">
        <button
          @click="onDownloadUpdate"
          class="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded shadow-md"
        >
          Download Update
        </button>
      </div>

      <p
        class="mt-5 text-sm"
        :class="displayMode === 'dark' ? 'text-blue-300' : 'text-blue-700'"
      >
        {{ updateMessage }}
      </p>

      <!-- Optional progress bar -->
      <div
        v-if="downloadPercent > 0 && downloadPercent < 100"
        class="w-full max-w-lg mx-auto bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mt-4"
      >
        <div
          class="bg-blue-500 h-3 transition-all duration-300"
          :style="{ width: downloadPercent + '%' }"
        ></div>
      </div>

      <div v-if="updateReady" class="mt-6">
        <button
          @click="onInstallUpdate"
          class="bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 text-black font-semibold px-6 py-2.5 rounded shadow-md"
        >
          Restart & Install
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  appVersion: {
    type: String,
    required: true
  },
  displayMode: {
    type: String,
    default: 'light'
  },
  updateAvailable: {
    type: Boolean,
    default: false
  },
  showUpdateUI: {
    type: Boolean,
    default: false
  },
  updateMessage: {
    type: String,
    default: ''
  },
  downloadPercent: {
    type: Number,
    default: 0
  },
  updateReady: {
    type: Boolean,
    default: false
  },
  onCheckForUpdate: {
    type: Function,
    required: true
  },
  onDownloadUpdate: {
    type: Function,
    required: true
  },
  onInstallUpdate: {
    type: Function,
    required: true
  }
})
</script>
