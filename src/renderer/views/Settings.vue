<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4 w-full">
    <h2 class="text-xl font-semibold mb-4 text-gray-100">Manage Views</h2>
    <div v-for="(view, index) in views" :key="index" class="">
      <div v-if="view.title !== 'Settings'" class="flex justify-between items-center mb-3 p-3">
        <span class="text-gray-200">{{ view.title }}</span>
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="view.visible" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-500 relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"
          ></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  views: {
    type: Array,
    required: true,
  },
})
</script>
