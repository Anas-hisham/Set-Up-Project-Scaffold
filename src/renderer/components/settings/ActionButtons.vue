<template>
  <div class="flex flex-wrap justify-between gap-4 my-10">
    <button
      @click="onReset"
      class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded shadow transition"
    >
      Reset to Defaults
    </button>
    <button
      @click="onClear"
      class="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow transition"
    >
      Clear Input Data
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  onReset: {
    type: Function,
    required: true
  },
  onClear: {
    type: Function,
    required: true
  }
})
</script>
