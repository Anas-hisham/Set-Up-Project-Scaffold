<script setup>
/* -----------------------------------------------
✅ Imports
-------------------------------------------------- */
import { ref, reactive, watch, onMounted } from 'vue'

/* -----------------------------------------------
✅ Props
-------------------------------------------------- */
defineProps({
  displayMode: {
    type: String,
    default: 'dark',
  },
})

/* -----------------------------------------------
✅ Alert state & functions
-------------------------------------------------- */
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

/* -----------------------------------------------
✅ Match info & matches state
-------------------------------------------------- */
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
    firstMatchImages: {
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
    secondMatchImages: {
      leftTeamLogo: '',
      rightTeamLogo: '',
      leftTeamFlag: '',
      rightTeamFlag: '',
    },
  },
])

/* -----------------------------------------------
✅ Open image dialog and set image
-------------------------------------------------- */
async function openImageDialog(matchIndex, field) {
  try {
    const result = await window.myAPI.openFileDialog({
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }],
    })

    if (result.canceled || !result.filePaths.length) return

    const imagePath = result.filePaths[0]
    const fileData = await window.myAPI.readFile(imagePath)
    const blob = new Blob([fileData])
    const imageUrl = URL.createObjectURL(blob)

    const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'
    const imagesKey = matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'

    // Clean up previous image
    if (matches.value[matchIndex][imagesKey][field]) {
      URL.revokeObjectURL(matches.value[matchIndex][imagesKey][field])
    }

    matches.value[matchIndex][matchKey][field] = imagePath
    matches.value[matchIndex][imagesKey][field] = imageUrl
  } catch (error) {
    console.error('Error loading image:', error)
    window.myAPI.showErrorDialog('Failed to load image')
  }
}

/* -----------------------------------------------
✅ Remove image (file path + display URL)
-------------------------------------------------- */
function removeImage(matchIndex, field) {
  const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'
  const imagesKey = matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'

  if (matches.value[matchIndex][imagesKey][field]) {
    URL.revokeObjectURL(matches.value[matchIndex][imagesKey][field])
  }

  matches.value[matchIndex][matchKey][field] = ''
  matches.value[matchIndex][imagesKey][field] = ''
}

/* -----------------------------------------------
✅ Save matches to file (excluding display URLs)
-------------------------------------------------- */
async function saveMatches() {
  try {
    const dataToSave = {
      info: matchInfo.value,
      matches: matches.value.map(match => ({
        firstMatch: match.firstMatch,
        secondMatch: match.secondMatch,
      })),
    }

    await window.myAPI.saveMatches(JSON.stringify(dataToSave))
    showAlert('Matches saved successfully!')
  } catch (err) {
    console.error('Error saving Matches:', err)
    window.myAPI.logError(`Error saving Matches: ${err.message}`)
  }
}

/* -----------------------------------------------
✅ Load saved data from cache
-------------------------------------------------- */
async function loadDataCache() {
  try {
    const loaded = await window.myAPI.loadMatchesCache()
    if (!loaded) return

    const parsedData = typeof loaded === 'string' ? JSON.parse(loaded) : loaded

    if (parsedData.info) {
      matchInfo.value.date = parsedData.info.date || ''
    }

    if (Array.isArray(parsedData.matches)) {
      for (let i = 0; i < parsedData.matches.length; i++) {
        const matchData = parsedData.matches[i]

        if (matchData.firstMatch) {
          matches.value[i].firstMatch = { ...matchData.firstMatch }
        }
        if (matchData.secondMatch) {
          matches.value[i].secondMatch = { ...matchData.secondMatch }
        }

        if (matchData.firstMatch) {
          await loadImageForField(i, 'firstMatch', 'leftTeamLogo')
          await loadImageForField(i, 'firstMatch', 'rightTeamLogo')
          await loadImageForField(i, 'firstMatch', 'leftTeamFlag')
          await loadImageForField(i, 'firstMatch', 'rightTeamFlag')
        }

        if (matchData.secondMatch) {
          await loadImageForField(i, 'secondMatch', 'leftTeamLogo')
          await loadImageForField(i, 'secondMatch', 'rightTeamLogo')
          await loadImageForField(i, 'secondMatch', 'leftTeamFlag')
          await loadImageForField(i, 'secondMatch', 'rightTeamFlag')
        }
      }
    }
  } catch (e) {
    console.error('Error loading Matches:', e)
    window.myAPI.logError(`Error loading Matches: ${e.message}`)
  }
}

/* -----------------------------------------------
✅ Load image for a field from saved path
-------------------------------------------------- */
async function loadImageForField(matchIndex, matchKey, field) {
  const path = matches.value[matchIndex][matchKey][field]
  if (!path) return

  try {
    const fileData = await window.myAPI.readFile(path)
    const blob = new Blob([fileData])
    const imageUrl = URL.createObjectURL(blob)

    const imagesKey = matchKey === 'firstMatch' ? 'firstMatchImages' : 'secondMatchImages'
    matches.value[matchIndex][imagesKey][field] = imageUrl
  } catch (error) {
    console.error(`Error loading image for ${field}:`, error)
    matches.value[matchIndex][matchKey][field] = ''
  }
}

/* -----------------------------------------------
✅ Auto-save to cache when matchInfo or matches change
-------------------------------------------------- */
watch(
  [() => matchInfo.value, () => matches.value],
  () => {
    const dataToSave = {
      info: matchInfo.value,
      matches: matches.value.map(match => ({
        firstMatch: match.firstMatch,
        secondMatch: match.secondMatch,
      })),
    }
    window.myAPI.saveMatchesCache(JSON.stringify(dataToSave))
  },
  { deep: true }
)

/* -----------------------------------------------
✅ On component mount, load cached data
-------------------------------------------------- */
onMounted(() => {
  loadDataCache()
})
</script>


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
    </div>

    <!-- Save Button -->
    <div class="flex justify-center">
      <button
        @click="saveMatches"
        class="px-6 py-3 bg-green-600 text-white  hover:bg-green-700 font-semibold"
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
      class="relative p-6  shadow-lg w-80 text-center"
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
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 "
        @click="closeAlert"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped>
.dark-mode input[type='date'],
.dark-mode input[type='time'] {
  color-scheme: dark;
}
input {
  outline: none;
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

