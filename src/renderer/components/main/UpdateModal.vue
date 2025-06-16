<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="onCancel"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-96 text-center"
      :class="displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-black'"
    >
      <!-- Close Button -->
      <button
        @click="onCancel"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <h2 class="text-xl font-bold mb-2">Update Available</h2>
      <p class="mb-2">Current version: {{ currentVersion }}</p>
      <p class="mb-4">New version: {{ newVersion }}</p>

      <div v-if="downloading" class="mb-4">
        <p>Downloading... {{ progress.toFixed(0) }}%</p>
        <div class="w-full bg-gray-300 h-2 rounded">
          <div
            class="bg-blue-500 h-2 rounded"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <button
        v-if="!downloading && !downloaded"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="onDownload"
      >
        Download Update
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  currentVersion: String,
  newVersion: String,
  progress: Number,
  downloading: Boolean,
  downloaded: Boolean,
  displayMode: String,
  onCancel: Function,
  onDownload: Function,
})
</script>

