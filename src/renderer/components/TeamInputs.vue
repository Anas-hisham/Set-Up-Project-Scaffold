<template>
  <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 items-center gap-4 p-4">
    <!-- Team Image -->
    <div
      class="flex justify-between lg:col-span-2 px-3 h-14 items-center gap-3 md:col-span-2"
      :class="
        displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
      "
    >
      <!-- Hidden file input always present -->
      <input
        type="file"
        class="hidden"
        :ref="(el) => (imageRefs[index] = el)"
        @change="handleFileChange($event, index, 'image')"
        accept="image/*"
      />
      <span class="text-sm">Team Image</span>

      <div v-if="team.image" class="flex items-center gap-2">
        <img
          :src="team.image"
          alt="Team"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="() => triggerFileInput(imageRefs, index)"
        />
        <button
          @click="
            () => {
              team.image = ''
            }
          "
          class="text-red-500 hover:text-red-700 font-semibold"
          type="button"
        >
          Delete
        </button>
      </div>

      <button
        v-else
        class="font-semibold cursor-pointer"
        :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
        @click="() => triggerFileInput(imageRefs, index)"
        type="button"
      >
        ADD +
      </button>
    </div>

    <!-- Team Flag -->
    <div
      class="flex justify-between lg:col-span-2 px-4 h-14 items-center gap-3 md:col-span-2"
      :class="
        displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
      "
    >
      <!-- Hidden file input always present -->
      <input
        type="file"
        class="hidden"
        :ref="(el) => (flagRefs[index] = el)"
        @change="handleFileChange($event, index, 'flag')"
        accept="image/*"
      />
      <span class="text-sm">Team Flag</span>

      <div v-if="team.flag" class="flex items-center gap-2 ">
        <img
          :src="team.flag"
          alt="Flag"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="() => triggerFileInput(flagRefs, index)"
        />
        <button
          @click="
            () => {
              team.flag = ''
            }
          "
          class="text-red-500 hover:text-red-700 font-semibold"
          type="button"
        >
          Delete
        </button>
      </div>

      <button
        v-else
        class="font-semibold cursor-pointer"
        :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
        @click="() => triggerFileInput(flagRefs, index)"
        type="button"
      >
        ADD +
      </button>
    </div>

    <!-- Team Name -->
    <div
      class="px-4 py-3 border relative"
      :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
    >
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>
      <input
        type="text"
        v-model="team.name"
        maxlength="13"
        placeholder="Team Name"
        class="outline-hidden pl-5 w-full"
        :class="
          displayMode === 'dark'
            ? 'placeholder-white placeholder-opacity-100 text-white'
            : 'placeholder-black placeholder-opacity-100 text-black'
        "
      />
    </div>

    <!-- Team Score -->
    <div
      class="px-4 py-3 border relative"
      :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
    >
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>
      <input
        type="number"
        v-model.number="team.score"
        placeholder="Team Score"
        class="outline-hidden pl-5 w-full"
        :class="
          displayMode === 'dark'
            ? 'placeholder-white placeholder-opacity-100 text-white'
            : 'placeholder-black placeholder-opacity-100 text-black'
        "
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  team: Object,
  index: Number,
  imageRefs: Array,
  flagRefs: Array,
  handleFileChange: Function,
  triggerFileInput: Function,
  displayMode: {
    type: String,
    default: 'light',
  },
})
</script>
<style>
button {
  cursor: pointer;
}
</style>
