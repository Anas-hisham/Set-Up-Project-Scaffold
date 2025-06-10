<template>
  <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 items-center gap-4 p-4">
    <!-- Team Image -->
    <div
      class="flex justify-between lg:col-span-2 px-3 h-14 items-center gap-3 md:col-span-2"
      :class="
        displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
      "
    >
      <input
        type="file"
        class="hidden"
        :ref="(el) => (imageRefs[index] = el)"
        @change="handleFileChange($event, index, 'teamImage')"
        accept="image/*"
      />
      <span class="text-sm">Team Image</span>

      <div v-if="team.teamImage" class="flex items-center gap-2">
        <img
          :src="team.teamImage"
          alt="Team"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="() => triggerFileInput(imageRefs, index)"
        />
        <button
          @click="
            () => {
              team.teamImage = ''
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
      <input
        type="file"
        class="hidden"
        :ref="(el) => (flagRefs[index] = el)"
        @change="handleFileChange($event, index, 'teamFlag')"
        accept="image/*"
      />
      <span class="text-sm">Team Flag</span>

      <div v-if="team.teamFlag" class="flex items-center gap-2">
        <img
          :src="team.teamFlag"
          alt="Flag"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="() => triggerFileInput(flagRefs, index)"
        />
        <button
          @click="
            () => {
              team.teamFlag = ''
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
    <!-- TEAM NAME -->
    <div class="col-span-1 relative mt-7 md:mt-0" >
      <label
        class=" w-max absolute left-1/2 -top-7 -translate-x-1/2 block mb-1 text-sm font-semibold"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      >
        Team Name
      </label>
      <div
        class="relative px-4 py-3 border"
        :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
      >
        <i
          class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
        ></i>
        <input
          type="text"
          v-model="team.teamName"
          maxlength="13"
          placeholder="Team Name"
          class="outline-none pl-5 w-full bg-transparent"
          :class="
            displayMode === 'dark' ? 'placeholder-white text-white' : 'placeholder-black text-black'
          "
        />
      </div>
    </div>

    <!-- Team Score -->
    <!-- TEAM SCORE -->
    <div class="col-span-1 relative mt-7 md:mt-0">
      <label
        class=" w-max absolute left-1/2 -top-7 -translate-x-1/2 block mb-1 text-sm font-semibold"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      >
        Team Score
      </label>
      <div
        class="relative px-4 py-3 border"
        :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
      >
        <i
          class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
        ></i>
        <input
          type="number"
          min="0"
          v-model.number="team.teamScore"
          placeholder="Team Score"
          class="outline-none pl-5 w-full bg-transparent"
          :class="
            displayMode === 'dark' ? 'placeholder-white text-white' : 'placeholder-black text-black'
          "
        />
      </div>
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
