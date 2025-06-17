<script setup>
/* -----------------------------------------------
✅ Imports
-------------------------------------------------- */
import { ref, reactive, watch, onMounted } from 'vue'
import MatchSection from '../components/matches/MatchSection.vue'
import InfoSection from '../components/matches/InfoSection.vue'
import SaveButton from '../components/SaveButton.vue'
import AlertComponent from '../components/AlertComponent.vue'
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
      matches: matches.value.map((match) => ({
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
      matchInfo.value = { ...matchInfo.value, ...parsedData.info }
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
      matches: matches.value.map((match) => ({
        firstMatch: match.firstMatch,
        secondMatch: match.secondMatch,
      })),
    }
    window.myAPI.saveMatchesCache(JSON.stringify(dataToSave))
  },
  { deep: true },
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

      <!-- Info Section -->
      <InfoSection :matchInfo="matchInfo" :displayMode="displayMode" />

      <!-- Matches Sections -->
      <MatchSection
        v-for="(match, matchIndex) in matches"
        :key="matchIndex"
        :match="match"
        :matchIndex="matchIndex"
        :displayMode="displayMode"
        :openImageDialog="openImageDialog"
        :removeImage="removeImage"
      />
    </div>

    <!-- Save Button -->

    <SaveButton title="Save Matches" :onClick="saveMatches" />
  </div>

  <AlertComponent
    v-if="alert.showAlert"
    :alert="alert"
    :displayMode="displayMode"
    :closeAlert="closeAlert"
  />
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
