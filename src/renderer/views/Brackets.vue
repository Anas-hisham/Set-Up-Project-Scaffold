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
        :teamImages="teamImages"
        :teamFlags="teamFlags"
        :openTeamImageOrFlagDialog="openTeamImageOrFlagDialog"
        :removeTeamImageOrFlag="removeTeamImageOrFlag"
        :displayMode="displayMode"
      />
    </div>
  </div>

  <SaveButton title="Save Teams" :onClick="saveTeamsToDisk" />

  <AlertDialog
    v-if="alert.showAlert"
    :alert="alert"
    :displayMode="displayMode"
    :closeAlert="closeAlert"
  />
</template>
<script setup>
// ─────────────────────────────────────
// ✅ Imports
// ─────────────────────────────────────
import { ref, onMounted, watch, computed, reactive } from 'vue'
import TeamInputs from '../components/brackets/TeamInputs.vue'
import AlertDialog from '../components/AlertComponent.vue'
import SaveButton from '../components/SaveButton.vue'

// ─────────────────────────────────────
// ✅ Props
// ─────────────────────────────────────
const props = defineProps({ displayMode: String })
const isDarkMode = computed(() => props.displayMode === 'dark')

// ─────────────────────────────────────
// ✅ Reactive State
// ─────────────────────────────────────
const teams = ref([])
const teamImages = ref([])
const teamFlags = ref([])

const alert = reactive({
  showAlert: false,
  text: '',
})

// ─────────────────────────────────────
// ✅ Alert Functions
// ─────────────────────────────────────
function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

function closeAlert() {
  alert.showAlert = false
}

// ─────────────────────────────────────
// ✅ Factory: Create a blank team object
// ─────────────────────────────────────
const createEmptyTeam = () => ({
  teamImage: '',
  teamFlag: '',
  teamName: '',
  teamScore: '',
})

// ─────────────────────────────────────
// ✅ Initialize Teams & UI Placeholders
// ─────────────────────────────────────
const initializeTeams = () => {
  teams.value = Array.from({ length: 32 }, createEmptyTeam)
  teamImages.value = Array(32).fill('')
  teamFlags.value = Array(32).fill('')
}

// ─────────────────────────────────────
// ✅ Image Handlers
// ─────────────────────────────────────
const openTeamImageOrFlagDialog = async (index, type) => {
  try {
    const result = await window.myAPI.openFileDialog({
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }],
    })

    if (result.canceled || !result.filePaths.length) return

    const imagePath = result.filePaths[0]
    const fileData = await window.myAPI.readFile(imagePath)
    const blob = new Blob([fileData])
    const imageUrl = URL.createObjectURL(blob)

    const targetList = type === 'image' ? teamImages : teamFlags
    const teamProp = type === 'image' ? 'teamImage' : 'teamFlag'

    if (targetList.value[index]) {
      URL.revokeObjectURL(targetList.value[index])
    }

    targetList.value[index] = imageUrl
    teams.value[index][teamProp] = imagePath
  } catch {
    const errorType = type === 'image' ? 'team image' : 'team flag'
    window.myAPI.showErrorDialog(`Failed to load ${errorType}`)
  }
}

// ─────────────────────────────────────
// ✅ Remove Images
// ─────────────────────────────────────
const removeTeamImageOrFlag = (index, type) => {
  const targetList = type === 'image' ? teamImages : teamFlags
  const teamProp = type === 'image' ? 'teamImage' : 'teamFlag'

  if (targetList.value[index]) {
    URL.revokeObjectURL(targetList.value[index])
  }

  targetList.value[index] = ''
  teams.value[index][teamProp] = ''
}

// ─────────────────────────────────────
// ✅ Save & Load to/from Disk
// ─────────────────────────────────────
const saveTeamsToDisk = async () => {
  try {
    await window.myAPI.saveTeams(JSON.stringify(teams.value))
    showAlert('Teams saved successfully!')
  } catch (err) {
    window.myAPI.logError(`Error saving teams: ${err.message}`)
    window.myAPI.showErrorDialog('Failed to save teams')
  }
}

const loadTeamsFromCache = async () => {
  try {
    const cached = await window.myAPI.loadTeamsCache()
    if (!Array.isArray(cached)) return

    // Prepare previews
    teamImages.value = Array(cached.length).fill('')
    teamFlags.value = Array(cached.length).fill('')

    for (let i = 0; i < cached.length; i++) {
      if (!teams.value[i]) teams.value[i] = createEmptyTeam()

      teams.value[i].teamName = cached[i].teamName || ''
      teams.value[i].teamScore = cached[i].teamScore || ''

      // Team Image
      if (cached[i].teamImage) {
        try {
          const fileData = await window.myAPI.readFile(cached[i].teamImage)
          const blob = new Blob([fileData])
          teamImages.value[i] = URL.createObjectURL(blob)
          teams.value[i].teamImage = cached[i].teamImage
        } catch {
          teamImages.value[i] = ''
          teams.value[i].teamImage = ''
        }
      }

      // Team Flag
      if (cached[i].teamFlag) {
        try {
          const fileData = await window.myAPI.readFile(cached[i].teamFlag)
          const blob = new Blob([fileData])
          teamFlags.value[i] = URL.createObjectURL(blob)
          teams.value[i].teamFlag = cached[i].teamFlag
        } catch {
          teamFlags.value[i] = ''
          teams.value[i].teamFlag = ''
        }
      }
    }
  } catch (err) {
    window.myAPI.logError(`Failed to load teams: ${err.message}`)
  }
}

// ─────────────────────────────────────
// ✅ Watchers
// ─────────────────────────────────────
// Auto save cache on any team change
watch(
  teams,
  () => {
    window.myAPI.saveTeamsCache(JSON.stringify(teams.value))
  },
  { deep: true },
)

// ─────────────────────────────────────
// ✅ Lifecycle Hook
// ─────────────────────────────────────
onMounted(() => {
  initializeTeams()
  loadTeamsFromCache()
})
</script>
