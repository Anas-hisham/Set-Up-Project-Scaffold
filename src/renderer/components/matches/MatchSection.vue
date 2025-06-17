<script setup>
defineProps({
  match: {
    type: Object,
    required: true
  },
  matchIndex: {
    type: Number,
    required: true
  },
  displayMode: {
    type: String,
    default: 'dark'
  },
  openImageDialog: {
    type: Function,
    required: true
  },
  removeImage: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div>
    <h2
      class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
      :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
    >
      {{ matchIndex === 0 ? 'first Match' : 'second Match' }}
    </h2>

    <div
      class="p-4 mb-6 grid gap-6"
      :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'"
    >
      <!-- Match Time -->
      <div class="relative" :class="displayMode === 'dark' ? 'text-white' : 'text-black'">
        <label
          class="text-sm font-semibold block mb-1"
          :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
        >
          Match Time
        </label>
        <div class="relative">
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="time"
            placeholder="Match Time"
            v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].matchTime"
            class="pl-8 w-full border py-2 px-2.5 placeholder-opacity-100"
          />
        </div>
      </div>

      <!-- Team Names -->
      <div
        class="grid grid-cols-2 gap-4"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      >
        <!-- Left Team Name -->
        <div class="relative">
          <label
            class="text-sm font-semibold block mb-1"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          >
            Left Team Name
          </label>
          <div class="relative">
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="text"
              placeholder="Left Team Name"
              v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].leftTeamName"
              class="pl-8 w-full border py-2 placeholder-opacity-100"
            />
          </div>
        </div>

        <!-- Right Team Name -->
        <div class="relative">
          <label
            class="text-sm font-semibold block mb-1"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          >
            Right Team Name
          </label>
          <div class="relative">
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="text"
              placeholder="Right Team Name"
              v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].rightTeamName"
              class="pl-8 w-full border py-2 placeholder-opacity-100"
            />
          </div>
        </div>
      </div>

      <!-- Logo and Flag Uploads -->
      <div
        class="grid grid-cols-2 gap-4"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      >
        <!-- Left Team Logo -->
        <div class="flex justify-between items-center border px-4 py-2">
          <span class="opacity-60">Left Team Logo</span>
          <div class="flex items-center gap-2">
            <img
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamLogo"
              :src="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamLogo"
              class="w-8 h-8 object-cover cursor-pointer"
              @click="openImageDialog(matchIndex, 'leftTeamLogo')"
              title="Click to change image"
            />
            <button
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamLogo"
              class="text-red-600 font-semibold hover:underline"
              @click="removeImage(matchIndex, 'leftTeamLogo')"
            >
              Delete
            </button>
            <button
              v-else
              class="text-green-400 font-semibold cursor-pointer"
              @click="openImageDialog(matchIndex, 'leftTeamLogo')"
            >
              + ADD
            </button>
          </div>
        </div>

        <!-- Right Team Logo -->
        <div class="flex justify-between items-center border px-4 py-2">
          <span class="opacity-60">Right Team Logo</span>
          <div class="flex items-center gap-2">
            <img
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamLogo"
              :src="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamLogo"
              class="w-8 h-8 object-cover cursor-pointer"
              @click="openImageDialog(matchIndex, 'rightTeamLogo')"
              title="Click to change image"
            />
            <button
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamLogo"
              class="text-red-600 font-semibold hover:underline"
              @click="removeImage(matchIndex, 'rightTeamLogo')"
            >
              Delete
            </button>
            <button
              v-else
              class="text-green-400 font-semibold cursor-pointer"
              @click="openImageDialog(matchIndex, 'rightTeamLogo')"
            >
              + ADD
            </button>
          </div>
        </div>

        <!-- Left Team Flag -->
        <div class="flex justify-between items-center border px-4 py-2">
          <span class="opacity-60">Left Team Flag</span>
          <div class="flex items-center gap-2">
            <img
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamFlag"
              :src="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamFlag"
              class="w-8 h-8 object-cover cursor-pointer"
              @click="openImageDialog(matchIndex, 'leftTeamFlag')"
              title="Click to change image"
            />
            <button
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].leftTeamFlag"
              class="text-red-600 font-semibold hover:underline"
              @click="removeImage(matchIndex, 'leftTeamFlag')"
            >
              Delete
            </button>
            <button
              v-else
              class="text-green-400 font-semibold cursor-pointer"
              @click="openImageDialog(matchIndex, 'leftTeamFlag')"
            >
              + ADD
            </button>
          </div>
        </div>

        <!-- Right Team Flag -->
        <div class="flex justify-between items-center border px-4 py-2">
          <span class="opacity-60">Right Team Flag</span>
          <div class="flex items-center gap-2">
            <img
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamFlag"
              :src="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamFlag"
              class="w-8 h-8 object-cover cursor-pointer"
              @click="openImageDialog(matchIndex, 'rightTeamFlag')"
              title="Click to change image"
            />
            <button
              v-if="match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'].rightTeamFlag"
              class="text-red-600 font-semibold hover:underline"
              @click="removeImage(matchIndex, 'rightTeamFlag')"
            >
              Delete
            </button>
            <button
              v-else
              class="text-green-400 font-semibold cursor-pointer"
              @click="openImageDialog(matchIndex, 'rightTeamFlag')"
            >
              + ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
