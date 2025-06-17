<script setup>
defineProps({
  alert: {
    type: Object,
    required: true
  },
  displayMode: {
    type: String,
    default: 'dark'
  },
  closeAlert: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeAlert"
  >
    <div
      class="relative p-6 shadow-lg w-80 text-center"
      :class="[displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <!-- Close Button -->
      <button
        @click="closeAlert"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>
      <p class="mb-4">{{ alert.text }}</p>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
        @click="closeAlert"
      >
        OK
      </button>
    </div>
  </div>
</template>
