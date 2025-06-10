<template>
  <div :class="displayMode === 'light' ? 'light-mode' : ''">
    <h1
      class="mt-12 text-4xl font-bold text-center mb-8"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Today's Matches
    </h1>

    <div class="px-4 py-3 mb-10">
      <!-- Info -->
      <h2
        class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
        :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
      >
        INFO
      </h2>

      <!-- Date Input -->
      <div class="p-4 mb-10" :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'">
        <div class="relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"></i>
          <input
            type="date"
            placeholder="Date"
            v-model="matchInfo.Date"
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
          {{ matchIndex === 0 ? 'FIRST MATCH' : 'SECOND MATCH' }}
        </h2>

        <div
          class="p-4 mb-6 grid gap-6"
          :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'"
        >
          <!-- Match Time -->
          <div class="relative" :class="displayMode === 'dark' ? 'text-white' : 'text-black'">
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="time"
              placeholder="Match Time"
              v-model="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Match Time']"
              class="pl-8 w-full border py-2 px-2.5 placeholder-opacity-100"
            />
          </div>
          <!-- Team Names -->
          <div
            class="grid grid-cols-2 gap-4"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          >
            <!-- Left Team Name -->
            <div class="relative">
              <i
                class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
                :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
              ></i>
              <input
                type="text"
                placeholder="Left Team Name"
                v-model="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Name']"
                class="pl-8 w-full border py-2 placeholder-opacity-100"
              />
            </div>

            <!-- Right Team Name -->
            <div class="relative">
              <i
                class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
                :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
              ></i>
              <input
                type="text"
                placeholder="Right Team Name"
                v-model="
                  match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Name']
                "
                class="pl-8 w-full border py-2 placeholder-opacity-100"
              />
            </div>
          </div>

          <!-- Images -->
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
                  :ref="(el) => setFileInputRef(matchIndex, 'Left Team Logo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'Left Team Logo')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Logo']"
                  :src="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Logo']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Left Team Logo')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Logo']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'Left Team Logo')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Left Team Logo')"
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
                  :ref="(el) => setFileInputRef(matchIndex, 'Right Team Logo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'Right Team Logo')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Logo']"
                  :src="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Logo']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Right Team Logo')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Logo']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'Right Team Logo')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Right Team Logo')"
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
                  :ref="(el) => setFileInputRef(matchIndex, 'Left Team Flag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'Left Team Flag')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Flag']"
                  :src="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Flag']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Left Team Flag')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Left Team Flag']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'Left Team Flag')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Left Team Flag')"
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
                  :ref="(el) => setFileInputRef(matchIndex, 'Right Team Flag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'Right Team Flag')"
                />
                <img
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Flag']"
                  :src="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Flag']"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Right Team Flag')"
                  title="Click to change image"
                />
                <button
                  v-if="match[matchIndex === 0 ? 'First Match' : 'Second Match']['Right Team Flag']"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'Right Team Flag')"
                >
                  Delete
                </button>
                <button
                  v-else
                  class="text-green-400 font-semibold cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'Right Team Flag')"
                >
                  + ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        @click="saveMatches"
        class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
      >
        Save Matches
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

defineProps({
  displayMode: {
    type: String,
    default: 'dark',
  },
})

const matchInfo = ref({
  Date: '',
})

const matches = ref([
  {
    'First Match': {
      'Match Time': '',
      'Left Team Name': '',
      'Right Team Name': '',
      'Left Team Logo': '',
      'Right Team Logo': '',
      'Left Team Flag': '',
      'Right Team Flag': '',
    },
  },
  {
    'Second Match': {
      'Match Time': '',
      'Left Team Name': '',
      'Right Team Name': '',
      'Left Team Logo': '',
      'Right Team Logo': '',
      'Left Team Flag': '',
      'Right Team Flag': '',
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
    const matchKey = matchIndex === 0 ? 'First Match' : 'Second Match'
    matches.value[matchIndex][matchKey][field] = reader.result
  }
  reader.readAsDataURL(file)
}

function deleteImage(matchIndex, field) {
  const matchKey = matchIndex === 0 ? 'First Match' : 'Second Match'
  matches.value[matchIndex][matchKey][field] = ''
}

async function saveMatches() {
  try {
    const dataToSave = {
      Info: matchInfo.value,
      Matches: matches.value,
    }
    await window.myAPI.saveMatches(JSON.stringify(dataToSave))
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

      if (parsedData.Info) {
        matchInfo.value.Date = parsedData.Info.Date || ''
      }

      if (parsedData.Matches && Array.isArray(parsedData.Matches)) {
        matches.value = parsedData.Matches
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
      Info: matchInfo.value,
      Matches: matches.value,
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
input[type='date'],
input[type='time'] {
  color-scheme: dark;
}
input {
  outline: none;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: transparent;
  color: white;
  caret-color: white;
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
