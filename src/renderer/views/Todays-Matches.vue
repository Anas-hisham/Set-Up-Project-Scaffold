<template>
  <h1 class="mt-12 text-4xl font-bold text-center text-white">Today's Matches</h1>

  <div class="px-4 py-8 mb-10">
    <!-- Info -->
    <h2 class="text-white font-semibold uppercase text-sm w-full bg-[#22292f] py-4 text-start px-5">
      INFO
    </h2>
    <div class="bg-[#1f2937] p-4 mb-10">
      <div class="relative text-white">
        <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
        <input
          type="text"
          placeholder="Date"
          v-model="matchInfo.date"
          class="pl-8 w-full bg-transparent border py-2 text-white"
        />
      </div>
    </div>

    <!-- Matches -->
    <div v-for="(match, matchIndex) in matches" :key="matchIndex">
      <h2
        class="text-white font-semibold uppercase text-sm w-full bg-[#22292f] py-4 text-start px-5"
      >
        {{ matchIndex === 0 ? 'FIRST MATCH' : 'SECOND MATCH' }}
      </h2>

      <div class="bg-[#1f2937] p-4 mb-6 grid gap-6">
        <!-- Time -->
        <div class="relative text-white mb-8">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            placeholder="Match Time"
            v-model="match.time"
            class="pl-8 w-full bg-transparent border py-2 text-white"
          />
        </div>

        <!-- Team Names -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-start relative pl-8 w-full bg-transparent border py-2 text-white">
            <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"> </i>
            <span>Left Team Name</span>
          </div>
          <div class="text-start relative pl-8 w-full bg-transparent border py-2 text-white">
            <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"> </i>
            <span>Right Team Name</span>
          </div>
        </div>

        <!-- Images -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="field in ['leftLogo', 'leftFlag']"
            :key="field + matchIndex"
            class="flex justify-between items-center border px-4 py-2 text-white"
          >
            <span class="opacity-60">{{
              field === 'leftLogo' ? 'Left Team Logo' : 'Left Team Flag'
            }}</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, field, el)"
                @change="(e) => uploadImage(e, matchIndex, field)"
              />
              <img v-if="match[field]" :src="match[field]" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, field)"
              >
                + ADD
              </button>
            </div>
          </div>

          <div
            v-for="field in ['rightLogo', 'rightFlag']"
            :key="field + matchIndex"
            class="flex justify-between items-center border px-4 py-2 text-white"
          >
            <span class="opacity-60">{{
              field === 'rightLogo' ? 'Right Team Logo' : 'Right Team Flag'
            }}</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, field, el)"
                @change="(e) => uploadImage(e, matchIndex, field)"
              />
              <img v-if="match[field]" :src="match[field]" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, field)"
              >
                + ADD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const matchInfo = ref({ date: '' })

const matches = ref([
  {
    time: '',
    leftName: '',
    rightName: '',
    leftLogo: '',
    rightLogo: '',
    leftFlag: '',
    rightFlag: '',
  },
  {
    time: '',
    leftName: '',
    rightName: '',
    leftLogo: '',
    rightLogo: '',
    leftFlag: '',
    rightFlag: '',
  },
])

// Store refs to each file input
const fileInputRefs = ref({})

function setFileInputRef(index, field, el) {
  if (!fileInputRefs.value[index]) fileInputRefs.value[index] = {}
  fileInputRefs.value[index][field] = el
}

function triggerFileInput(index, field) {
  const inputEl = fileInputRefs.value[index]?.[field]
  if (inputEl) inputEl.click()
}

function uploadImage(event, matchIndex, field) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    matches.value[matchIndex][field] = reader.result
  }
  reader.readAsDataURL(file)
}
</script>

<style>
input[type='date'],
input[type='time'] {
  color-scheme: dark;
}
</style>
