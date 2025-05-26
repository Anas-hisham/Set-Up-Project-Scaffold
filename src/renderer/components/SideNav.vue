<template>
  <nav class="col-span-3 lg:col-span-2 bg-gray-800 text-white p-4">
    <div class="flex justify-center items-center h-[calc(100vh-60px)]">
      <ul style="list-style: none; padding: 0">
        <li
          v-for="(view, index) in views"
          :key="view.title"
          :class="{ selected: selectedIndex === index }"
          @click="selected(index)"
          style="padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; margin-bottom: 0.5rem"
        >
          {{ view.title }}
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  views: Array,
  selectedIndex: Number,
  selected: Function,
})
</script>

<style scoped>
.selected {
  background-color: #3b82f6;
  font-weight: bold;
  color: white;
}
</style>
