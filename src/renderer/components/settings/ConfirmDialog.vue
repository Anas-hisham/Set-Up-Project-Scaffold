<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="onCancel"
  >
    <div
      class="relative p-6 rounded shadow-lg w-100 text-center"
      :class="[displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <button
        @click="onCancel"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <p class="mb-4">{{ message }}</p>

      <div class="flex justify-around gap-2">
        <button
          class="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          @click="onConfirm(false)"
        >
          Create New Presist
        </button>
        <button
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="onConfirm(true)"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  message: String,
  displayMode: String,
  onCancel: Function,
  onConfirm: Function
})
</script>
