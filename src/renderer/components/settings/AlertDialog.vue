<template>
  <div
    v-if="showAlert"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="onClose"
  >
    <div
      class="relative p-6 rounded shadow-lg w-100 text-center"
      :class="[displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <!-- Close Button -->
      <button
        @click="onClose"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <p class="mb-4">{{ text }}</p>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="onClose"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showAlert: Boolean,
  text: String,
  displayMode: String,
  onClose: Function
})
</script>
