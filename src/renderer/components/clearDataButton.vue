<template>
  <div class="flex justify-center mt-3">
    <button
      @click="props.onClick"
      class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
    >
      {{title}}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  onClick: Function,
  title:String
});
</script>
