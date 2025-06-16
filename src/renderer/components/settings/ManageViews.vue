<template>
  <div class="mt-8">
    <h3
      :class="[
        'text-xl font-bold mb-4',
        displayMode === 'light' ? 'text-black' : 'text-white',
      ]"
    >
      Manage Views
    </h3>
    <div class="bg-opacity-50 py-4 rounded">
      <div
        v-for="(view, index) in views"
        :key="index"
        class="flex items-center justify-between py-4 border-b"
        :class="displayMode === 'dark' ? 'border-gray-700' : 'border-gray-300'"
      >
        <span
          :class="['font-medium', displayMode === 'light' ? 'text-black' : 'text-white']"
        >
          {{ view.title }}
        </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="view.visible"
            @change="onViewVisibilityChange(index, $event)"
            class="sr-only peer"
          />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
            :class="
              displayMode === 'dark'
                ? 'peer-checked:bg-blue-600 bg-gray-700'
                : 'peer-checked:bg-blue-500 bg-gray-300'
            "
          ></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  views: {
    type: Array,
    required: true
  },
  displayMode: {
    type: String,
    default: 'light'
  },
  onViewVisibilityChange: {
    type: Function,
    required: true
  }
})
</script>
