<template>
  <main
    class="main-content col-span-9 lg:col-span-10 text-white p-6 bg-[#2a3444] min-h-[calc(100vh)]"
  >
    <component :is="currentComponent" />
  </main>
</template>

<script setup>
defineProps({
  currentComponent: [Object, Function],
})
</script>
