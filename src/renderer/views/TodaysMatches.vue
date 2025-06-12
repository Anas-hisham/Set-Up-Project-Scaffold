<template>
  <div :class="displayMode === 'light' ? 'light-mode' : 'dark-mode'">
    <h1
      class="mt-12 text-4xl font-bold text-center mb-8"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Today's Matches
    </h1>

    <div class="px-4 py-3 mb-10">
      <!-- Info Header -->
      <h2
        class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
        :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
      >
        INFO
      </h2>

      <!-- Date Input -->
      <div class="p-4 mb-10" :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'">
        <label
          v-if="matchInfo"
          class="text-sm font-semibold block mb-1"
          :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
        >
          Date
        </label>
        <div class="relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"></i>
          <input
            type="date"
            placeholder="Date"
            v-model="matchInfo.date"
            class="pl-8 w-full border py-2 px-3"
            max="9999-12-31"
          />
        </div>
      </div>

      <!-- Matches -->
      <div v-for="(match, matchIndex) in matches" :key="matchIndex">
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

          <!-- Logo and Flag Uploads (labels not needed for images, using span instead) -->
          <div
            class="grid grid-cols-2 gap-4"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          >
            <!-- Left Team Logo -->
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Left Team Logo</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'leftTeamLogo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'leftTeamLogo')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamLogo']"
                  :src="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamLogo']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftTeamLogo')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamLogo']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'leftTeamLogo')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftTeamLogo')"
                >
                  + ADD
                </button>
              </div>
            </div>

            <!-- Right Team Logo -->
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Right Team Logo</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'rightTeamLogo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'rightTeamLogo')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamLogo']"
                  :src="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamLogo']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightTeamLogo')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamLogo']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'rightTeamLogo')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightTeamLogo')"
                >
                  + ADD
                </button>
              </div>
            </div>

            <!-- Left Team Flag -->
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Left Team Flag</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'leftTeamFlag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'leftTeamFlag')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamFlag']"
                  :src="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamFlag']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftTeamFlag')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['leftTeamFlag']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'leftTeamFlag')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftTeamFlag')"
                >
                  + ADD
                </button>
              </div>
            </div>

            <!-- Right Team Flag -->
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Right Team Flag</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'rightTeamFlag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'rightTeamFlag')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamFlag']"
                  :src="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamFlag']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightTeamFlag')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch']['rightTeamFlag']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'rightTeamFlag')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightTeamFlag')"
                >
                  + ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-center">
      <button
        @click="saveMatches"
        class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
      >
        Save Matches
      </button>
    </div>
  </div>

  <div
    v-if="alert.showAlert"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeAlert"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-80 text-center"
      :class="[displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <!-- Close Button -->
      <button
        @click="closeAlert"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>
      <p class="mb-4">{{ alert.text }}</p>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="closeAlert"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'

defineProps({
  displayMode: {
    type: String,
    default: 'dark',
  },
})

const alert = reactive({
  showAlert: false,
  text: '',
})

function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

function closeAlert() {
  alert.showAlert = false
}

const matchInfo = ref({
  date: '',
})

const matches = ref([
  {
    firstMatch: {
      matchTime: '',
      leftTeamName: '',
      rightTeamName: '',
      leftTeamLogo: '',
      rightTeamLogo: '',
      leftTeamFlag: '',
      rightTeamFlag: '',
    },
  },
  {
    secondMatch: {
      matchTime: '',
      leftTeamName: '',
      rightTeamName: '',
      leftTeamLogo: '',
      rightTeamLogo: '',
      leftTeamFlag: '',
      rightTeamFlag: '',
    },
  },
])

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
    const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'

    matches.value[matchIndex][matchKey][field] = reader.result
  }
  reader.readAsDataURL(file)
}

function deleteImage(matchIndex, field) {
  const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'

  matches.value[matchIndex][matchKey][field] = ''
}

async function saveMatches() {
  try {
    const dataToSave = {
      info: matchInfo.value,
      matches: matches.value,
    }
    await window.myAPI.saveMatches(JSON.stringify(dataToSave))
    showAlert('Matches saved successfully!')
  } catch (err) {
    console.error('Error saving Matches:', err)
    window.myAPI.logError(`Error saving Matches: ${err.message}`)
  }
}

async function loadDataCache() {
  try {
    const loaded = await window.myAPI.loadMatchesCache()
    if (loaded) {
      const parsedData = typeof loaded === 'string' ? JSON.parse(loaded) : loaded

      if (parsedData.info) {
        matchInfo.value.date = parsedData.info.date || ''
      }

      if (parsedData.matches && Array.isArray(parsedData.matches)) {
        matches.value = parsedData.matches
      }
    }
  } catch (e) {
    console.error('Error loading Matches:', e)
    window.myAPI.logError(`Error loading Matches: ${e.message}`)
  }
}

watch(
  [() => matchInfo.value, () => matches.value],
  () => {
    const dataToSave = {
      info: matchInfo.value,
      matches: matches.value,
    }
    window.myAPI.saveMatchesCache(JSON.stringify(dataToSave))
  },
  { deep: true },
)

onMounted(() => {
  loadDataCache()
})
</script>

<style scoped>
.dark-mode input[type='date'],
.dark-mode input[type='time'] {
  color-scheme: dark;
}
input {
  outline: none;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: transparent;
  transition: border-color 0.2s;
}

input::placeholder {
  color: white;
  opacity: 1 !important;
}

.light-mode input::placeholder {
  color: #888;
  opacity: 1 !important;
}
</style>
