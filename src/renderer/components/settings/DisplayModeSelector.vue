<template>
  <div>
    <label :class="['block text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-black']">
      Display Mode
    </label>
    <select
      v-model="settings.displayMode"
      class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-400"
      :class="isDark ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  settings: Object,
  isDark: Boolean,
});
</script>
