<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="isDarkMode ? 'text-white' : 'text-black'"
  >
    Brackets view
  </h1>

  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-2">
      <TeamInputs
        v-for="(team, index) in teams"
        :key="index"
        :team="team"
        :index="index"
        :imageRefs="imageRefs"
        :flagRefs="flagRefs"
        :handleFileChange="handleFileChange"
        :triggerFileInput="triggerFileInput"
        :displayMode="displayMode"
      />
    </div>
  </div>

  <div class="flex justify-center mb-10">
    <button
      @click="saveTeamsToDisk"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Teams
    </button>
  </div>
    <div
    v-if="alert.showAlert"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeAlert"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-80 text-center"
      :class="[
        props.displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
      ]"
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
import { ref, onMounted, watch, computed, reactive } from 'vue'
import TeamInputs from '../components/TeamInputs.vue'

const props = defineProps({ displayMode: String })
const isDarkMode = computed(() => props.displayMode === 'dark')

const teams = ref([])
const imageRefs = ref([])
const flagRefs = ref([])



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






// ----- Factory -----
const createEmptyTeam = () => ({
  teamImage: '',
  teamFlag: '',
  teamName: '',
  teamScore: '',
})

// ----- Init Data -----
const initializeTeams = () => {
  teams.value = Array.from({ length: 32 }, createEmptyTeam)
}

// ----- File Handling -----
const handleFileChange = (event, index, field) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    teams.value[index][field] = reader.result
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = (refsArray, index) => {
  refsArray[index]?.click()
}

// ----- Storage Layer -----
const saveTeamsToDisk = async () => {
  try {
    await window.myAPI.saveTeams(JSON.stringify(teams.value))
    showAlert('Teams saved successfully!')
  } catch (err) {
    logError('Error saving teams', err)
  }
}

const loadTeamsFromCache = async () => {
  try {
    const cached = await window.myAPI.loadTeamsCache()
    if (Array.isArray(cached)) {
      cached.forEach((team, index) => {
        if (!teams.value[index]) return
        teams.value[index] = {
          teamImage: team.teamImage || '',
          teamFlag: team.teamFlag || '',
          teamName: team.teamName || '',
          teamScore: team.teamScore || '',
        }
      })
    }
  } catch (err) {
    logError('Failed to load teams', err)
  }
}

const logError = (message, error) => {
  window.myAPI.logError(`${message}: ${error.message}`)
}

// ----- Auto Save on Change -----
watch(
  teams,
  () => {
    window.myAPI.saveTeamsCache(JSON.stringify(teams.value))
  },
  { deep: true },
)

// ----- Lifecycle -----
onMounted(() => {
  initializeTeams()
  loadTeamsFromCache()
})
</script>
