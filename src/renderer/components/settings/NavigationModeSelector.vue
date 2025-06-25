<template>
  <div>
    <label :class="['block text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-black']">
      Navigation Mode
    </label>
    <select
      v-model="settings.navMode"
      class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-400"
      :class="
        isDark ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
      "
    >
      <option value="full">Full</option>
      <option value="mini">Mini</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  settings: Object,
  isDark: Boolean,
})
</script>
