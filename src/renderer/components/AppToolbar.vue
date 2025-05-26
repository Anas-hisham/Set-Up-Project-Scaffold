<!-- components/AppToolbar.vue -->
<template>
  <header class="app-toolbar bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
    <h1 class="text-xl font-semibold m-0">
      {{ currentTitle }}
    </h1>
    <div class="toolbar-actions flex gap-5">
      <button
        @click="refreshView"
        title="Refresh"
        class="text-white bg-transparent border-none cursor-pointer hover:opacity-80"
      >
        <i class="pi pi-sync" style="font-size: 1.3rem"></i>
      </button>
      <button
        @click="openSettings"
        title="Settings"
        class="text-white bg-transparent border-none cursor-pointer hover:opacity-80"
      >
        <i class="pi pi-cog" style="font-size: 1.3rem"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  currentTitle: String,
  refreshView: Function,
  openSettings: Function,
})
</script>
