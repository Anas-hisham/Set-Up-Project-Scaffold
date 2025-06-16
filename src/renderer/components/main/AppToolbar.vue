<template>
  <header
    :class="[
      'app-toolbar px-6 py-4 flex items-center justify-between',
      displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'
    ]"
  >
    <h1 class="text-xl font-semibold m-0">
      {{ currentTitle }}
    </h1>
    <div class="toolbar-actions flex gap-5">
      <button
        @click="openSettings"
        title="Settings"
        :class="[
          'bg-transparent border-none cursor-pointer hover:opacity-80',
          displayMode === 'dark' ? 'text-white' : 'text-black'
        ]"
      >
        <i class="pi pi-cog" style="font-size: 1.3rem"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  currentTitle: String,
  openSettings: Function,
  displayMode: String,
})
</script>
