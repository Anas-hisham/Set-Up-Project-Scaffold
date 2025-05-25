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
          type="date"
          placeholder="Date"
          v-model="matchInfo.date"
          class="pl-8 w-full bg-transparent border py-2 px-3 text-white placeholder-white placeholder-opacity-100"
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
            type="time"
            placeholder="Match Time"
            v-model="match.time"
            class="pl-8 w-full bg-transparent border py-2 px-2.5 text-white placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Team Names -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Left Team Name Input -->
          <div class="relative text-white">
            <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
            <input
              type="text"
              placeholder="Left Team Name"
              v-model="match.leftName"
              class="pl-8 w-full bg-transparent border py-2 text-white placeholder-white placeholder-opacity-100"
            />
          </div>

          <!-- Right Team Name Input -->
          <div class="relative text-white">
            <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
            <input
              type="text"
              placeholder="Right Team Name"
              v-model="match.rightName"
              class="pl-8 w-full bg-transparent border py-2 text-white placeholder-white placeholder-opacity-100"
            />
          </div>
        </div>

        <!-- Images -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Left Logo -->
          <div class="flex justify-between items-center border px-4 py-2 text-white">
            <span class="opacity-60">Left Team Logo</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, 'leftLogo', el)"
                @change="(e) => uploadImage(e, matchIndex, 'leftLogo')"
              />
              <img v-if="match.leftLogo" :src="match.leftLogo" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, 'leftLogo')"
              >
                + ADD
              </button>
            </div>
          </div>

          <!-- Right Logo -->
          <div class="flex justify-between items-center border px-4 py-2 text-white">
            <span class="opacity-60">Right Team Logo</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, 'rightLogo', el)"
                @change="(e) => uploadImage(e, matchIndex, 'rightLogo')"
              />
              <img v-if="match.rightLogo" :src="match.rightLogo" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, 'rightLogo')"
              >
                + ADD
              </button>
            </div>
          </div>

          <!-- Left Flag -->
          <div class="flex justify-between items-center border px-4 py-2 text-white">
            <span class="opacity-60">Left Team Flag</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, 'leftFlag', el)"
                @change="(e) => uploadImage(e, matchIndex, 'leftFlag')"
              />
              <img v-if="match.leftFlag" :src="match.leftFlag" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, 'leftFlag')"
              >
                + ADD
              </button>
            </div>
          </div>

          <!-- Right Flag -->
          <div class="flex justify-between items-center border px-4 py-2 text-white">
            <span class="opacity-60">Right Team Flag</span>
            <div>
              <input
                type="file"
                class="hidden"
                :ref="(el) => setFileInputRef(matchIndex, 'rightFlag', el)"
                @change="(e) => uploadImage(e, matchIndex, 'rightFlag')"
              />
              <img v-if="match.rightFlag" :src="match.rightFlag" class="w-8 h-8 object-cover" />
              <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="triggerFileInput(matchIndex, 'rightFlag')"
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
console.log(matches);

</script>

<style>
input[type='date'],
input[type='time'] {
  color-scheme: dark;
}
input {
  outline: none;
}
</style>
