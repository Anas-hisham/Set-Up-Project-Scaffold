<template>
  <div class="flex justify-center mt-3">
    <button
      @click="props.onClick"
      class="px-6 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold"
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
