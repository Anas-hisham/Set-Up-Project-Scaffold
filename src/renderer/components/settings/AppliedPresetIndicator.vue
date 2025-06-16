<template>
  <div
    v-if="preset"
    class="text-sm mb-2"
    :class="displayMode === 'light' ? 'text-gray-600' : 'text-gray-300'"
  >
    Currently applied preset: <span class="font-semibold">{{ preset }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  preset: {
    type: String,
    default: null
  },
  displayMode: {
    type: String,
    default: 'light'
  }
})
</script>
