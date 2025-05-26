<template>
  <div :class="displayMode === 'light' ? 'light-mode' : ''" >
    <h1
      class="mt-12 text-4xl font-bold text-center mb-8"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Today's Matches
    </h1>

    <div class="px-4 py-3 mb-10">
      <!-- Info -->
      <h2
        class="font-semibold uppercase text-sm w-full py-4 text-start px-5 "
        :class="displayMode === 'dark' ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
      >
        INFO
      </h2>

      <div class="p-4 mb-10" :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'">
        <div class="relative" :class="displayMode === 'dark' ? 'text-white' : 'text-black'">
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="date"
            placeholder="Date"
            v-model="matchInfo.date"
            class="pl-8 w-full border py-2 px-3 placeholder-opacity-100"
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
          <!-- Time -->
          <div class="relative mb-8" :class="displayMode === 'dark' ? 'text-white' : 'text-black'">
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="time"
              placeholder="Match Time"
              v-model="match.time"
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
                v-model="match.leftName"
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
                v-model="match.rightName"
                class="pl-8 w-full border py-2 placeholder-opacity-100"
              />
            </div>
          </div>

          <!-- Images -->
          <div
            class="grid grid-cols-2 gap-4"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
          >
            <!-- Left Logo -->
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Left Team Logo</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'leftLogo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'leftLogo')"
                />
                <img
                  v-if="match.leftLogo"
                  :src="match.leftLogo"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftLogo')"
                  title="Click to change image"
                />
                <button
                  v-if="match.leftLogo"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'leftLogo')"
                >
                  Delete
                </button>
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
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Right Team Logo</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'rightLogo', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'rightLogo')"
                />
                <img
                  v-if="match.rightLogo"
                  :src="match.rightLogo"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightLogo')"
                  title="Click to change image"
                />
                <button
                  v-if="match.rightLogo"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'rightLogo')"
                >
                  Delete
                </button>
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
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Left Team Flag</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'leftFlag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'leftFlag')"
                />
                <img
                  v-if="match.leftFlag"
                  :src="match.leftFlag"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'leftFlag')"
                  title="Click to change image"
                />
                <button
                  v-if="match.leftFlag"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'leftFlag')"
                >
                  Delete
                </button>
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
            <div class="flex justify-between items-center border px-4 py-2">
              <span class="opacity-60">Right Team Flag</span>
              <div class="flex items-center gap-2">
                <input
                  type="file"
                  class="hidden"
                  :ref="(el) => setFileInputRef(matchIndex, 'rightFlag', el)"
                  @change="(e) => uploadImage(e, matchIndex, 'rightFlag')"
                />
                <img
                  v-if="match.rightFlag"
                  :src="match.rightFlag"
                  class="w-8 h-8 object-cover cursor-pointer"
                  @click="triggerFileInput(matchIndex, 'rightFlag')"
                  title="Click to change image"
                />
                <button
                  v-if="match.rightFlag"
                  class="text-red-600 font-semibold hover:underline"
                  @click="() => deleteImage(matchIndex, 'rightFlag')"
                >
                  Delete
                </button>
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
  </div>
  <div class="flex justify-center">
    <button
      @click="saveAndAlertPlayers"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Matches
    </button>
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

function deleteImage(matchIndex, field) {
  matches.value[matchIndex][field] = ''
}

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
async function saveData() {
  try {
    const dataToSave = JSON.stringify({
      matchInfo: matchInfo.value,
      matches: matches.value,
    });
    const result = await window.myAPI.saveMatches(dataToSave);

    if (!result.success) {
      console.error('Failed to save data:', result.error);
    }
    return result; // <-- Return result here!
  } catch (e) {
    console.error('Save error:', e);
    return { success: false, error: e.message || e.toString() }; // Return failure info
  }
}

async function saveAndAlertPlayers() {
  try {
    const result = await saveData();
    if (result && result.success) {
      alert('Matches saved successfully!');
    } else {
      alert('Failed to save Matches: ' + (result.error || 'Unknown error'));
      console.error('Failed to save Matches:', result.error);
    }
  } catch (err) {
    alert('Error saving Matches: ' + err.message);
    console.error('Error saving Matches:', err);
  }
}


async function loadData() {
  try {
    const loaded = await window.myAPI.loadMatches()
    if (loaded.matchInfo) matchInfo.value = loaded.matchInfo
    if (loaded.matches) matches.value = loaded.matches
  } catch (e) {
    console.error('Load error:', e)
  }
}

watch(
  [matchInfo, matches],
  () => {
    saveData()
  },
  { deep: true },
)

onMounted(() => {
  loadData()
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

input:focus {
  border-color: #3b82f6; /* blue on focus */
}

.light-mode input[type='date'],
.light-mode input[type='time'],
.light-mode input {
  color-scheme: light;
  background-color: white;
  color: black;
  caret-color: black;
  border-color: #ccc;
}

.light-mode input::placeholder {
  color: #888;
  opacity: 1 !important;
}
</style>
