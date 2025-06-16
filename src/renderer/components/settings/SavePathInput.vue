<template>
   <div class="md:col-span-2 flex items-center gap-4 justify-center">
        <div class="flex-grow">
          <input
            v-model="settings.savePath"
            type="text"
            :placeholder="folderPath.value ? folderPath.value : settings.savePath"
            class="w-full p-2 rounded border"
            :class="
              settings.displayMode === 'dark'
                ? 'bg-gray-900 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            "
          />
        </div>
        <button
          class="font-bold px-4 py-2"
          :class="[settings.displayMode === 'dark' ? 'text-white' : 'text-black']"
          @click="selectFolder"
        >
          Select Folder
        </button>
        <button
          @click="applySavePath"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded shadow transition"
        >
          Apply Path
        </button>
      </div>
</template>

<script setup>
defineProps({
  settings: Object,
  folderPath: String,
  selectFolder: Function,
  applySavePath: Function,
  isDark: Boolean,
});
</script>
