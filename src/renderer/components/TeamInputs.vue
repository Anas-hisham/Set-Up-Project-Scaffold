<template>
  <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 items-center gap-4 p-4">
    <!-- Team Image -->
    <div
      class="flex justify-between lg:col-span-2 px-3 h-14 items-center gap-3 md:col-span-2"
      :class="
        displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
      "
    >
      <span class="text-sm">Team Image</span>
      <div v-if="teamImages[index]" class="flex items-center gap-2">
        <img
          :src="teamImages[index]"
          alt="Team"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="openTeamImageOrFlagDialog(index, 'image')"
        />
        <button
          type="button"
          class="text-red-500 font-semibold hover:underline"
          @click="removeTeamImageOrFlag(index, 'image')"
          title="Delete image"
        >
          Delete
        </button>
      </div>
      <button
        v-else
        class="font-semibold cursor-pointer"
        :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
        @click="openTeamImageOrFlagDialog(index, 'image')"
      >
        + ADD
      </button>
    </div>

    <!-- Team Flag -->
    <div
      class="flex justify-between lg:col-span-2 px-4 h-14 items-center gap-3 md:col-span-2"
      :class="
        displayMode === 'dark' ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
      "
    >
      <span class="text-sm">Team Flag</span>
      <div v-if="teamFlags[index]" class="flex items-center gap-2">
        <img
          :src="teamFlags[index]"
          alt="Flag"
          class="w-12 h-12 object-cover cursor-pointer"
          @click="openTeamImageOrFlagDialog(index, 'flag')"
          title="Click to change flag"
        />
        <button
          type="button"
          class="text-red-500 font-semibold hover:underline"
          @click="removeTeamImageOrFlag(index, 'flag')"
          title="Delete flag"
        >
          Delete
        </button>
      </div>
      <button
        v-else
        class="font-semibold cursor-pointer"
        :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
        @click="openTeamImageOrFlagDialog(index, 'flag')"
      >
        + ADD
      </button>
    </div>

    <!-- Team Name -->
    <div class="col-span-1 relative mt-7 md:mt-0">
      <label
        class="w-max absolute left-1/2 -top-7 -translate-x-1/2 block mb-1 text-sm font-semibold"
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
    <div class="col-span-1 relative mt-7 md:mt-0">
      <label
        class="w-max absolute left-1/2 -top-7 -translate-x-1/2 block mb-1 text-sm font-semibold"
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
  teamImages: Array,
  teamFlags: Array,
  openTeamImageOrFlagDialog: Function,
  removeTeamImageOrFlag: Function,

  displayMode: {
    type: String,
    default: 'light',
  },
})
</script>
