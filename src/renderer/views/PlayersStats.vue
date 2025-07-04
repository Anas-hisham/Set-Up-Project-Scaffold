<template>
  <PlayerStatsTitle :displayMode="displayMode" />

  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-6">
      <PlayerStatsForm
        v-for="(player, index) in players"
        :key="index"
        :player="player"
        :index="index"
        :displayMode="displayMode"
        :heroImage="heroImages[index]"
        :onImageChange="openHeroImageDialog"
        :onImageRemove="removeHeroImage"
      />
    </div>
  </div>
  <div class="flex justify-around">
    <SaveButton title="Save Players" :onClick="savePlayers" />
    <clearDataButton title=" Clear Input Data" :onClick="clearData" />
  </div>

  <AlertDialog :alert="alert" :displayMode="'dark'" :closeAlert="closeAlert" />
</template>

<script setup>
// ─────────────────────────────────────
// Imports
// ─────────────────────────────────────
import { ref, reactive, watch, onMounted } from 'vue'
import PlayerStatsTitle from '../components/playersStats/PlayerStatsTitle.vue'
import AlertDialog from '../components/AlertComponent.vue'
import SaveButton from '../components/SaveButton.vue'
import clearDataButton from '../components/clearDataButton.vue'
import PlayerStatsForm from '../components/playersStats/PlayerStatsForm.vue'

// ─────────────────────────────────────
// Props
// ─────────────────────────────────────
const props = defineProps({
  displayMode: {
    type: String,
    default: 'light',
  },
})

// ─────────────────────────────────────
// Reactive State
// ─────────────────────────────────────

const players = ref([
  {
    playerName: '',
    teamName: '',
    favouriteWeapon: '',
    economyScore: '',
    heroImage: '',
    kills: '',
    deaths: '',
    assists: '',
  },
])

const heroImages = ref([''])

const alert = reactive({
  showAlert: false,
  text: '',
})

// ─────────────────────────────────────
// Alert Handlers
// ─────────────────────────────────────

// Show alert with custom message
function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

function closeAlert() {
  alert.showAlert = false
}

// ─────────────────────────────────────
// Image Handling
// ─────────────────────────────────────

// Open image file dialog and preview image
function openHeroImageDialog(index) {
  window.myAPI
    .openFileDialog({
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }],
    })
    .then((result) => {
      if (result.canceled || !result.filePaths.length) return

      const imagePath = result.filePaths[0]

      window.myAPI
        .readFile(imagePath)
        .then((fileData) => {
          const blob = new Blob([fileData])
          const imageUrl = URL.createObjectURL(blob)

          heroImages.value[index] = imageUrl
          players.value[index].heroImage = imagePath
        })
        .catch(() => {
          window.myAPI.showErrorDialog('Failed to read hero image')
        })
    })
    .catch(() => {
      window.myAPI.showErrorDialog('Failed to open image dialog')
    })
}

// Remove selected hero image
function removeHeroImage(index) {
  if (heroImages.value[index]) {
    URL.revokeObjectURL(heroImages.value[index])
  }
  heroImages.value[index] = ''
  players.value[index].heroImage = ''
}

// ─────────────────────────────────────
// Save & Load Players
// ─────────────────────────────────────

// Save player data (only first player)
function savePlayers() {
  const data = JSON.stringify(players.value[0])
  window.myAPI
    .savePlayer(data)
    .then(() => {
      showAlert('Players saved successfully!')
    })
    .catch(() => {
      window.myAPI.showErrorDialog('Failed to save players')
    })
}

// Load cached players and preview images
function loadCachedPlayers() {
  window.myAPI
    .loadPlayerCache()
    .then((cached) => {
      if (!Array.isArray(cached)) return

      players.value = cached
      heroImages.value = []

      cached.forEach((player, i) => {
        if (player.heroImage) {
          window.myAPI
            .readFile(player.heroImage)
            .then((fileData) => {
              const blob = new Blob([fileData])
              heroImages.value[i] = URL.createObjectURL(blob)
            })
            .catch(() => {
              heroImages.value[i] = ''
            })
        } else {
          heroImages.value[i] = ''
        }
      })
    })
    .catch(() => {
      window.myAPI.showErrorDialog('Failed to load player cache')
    })
}

// ─────────────────────────────────────
// Clear all players data and images
// ─────────────────────────────────────
function clearData() {
  // Revoke any existing object URLs
  heroImages.value.forEach(img => {
    if (img) URL.revokeObjectURL(img);
  });

  players.value = [{
    playerName: '',
    teamName: '',
    favouriteWeapon: '',
    economyScore: '',
    heroImage: '',
    kills: '',
    deaths: '',
    assists: '',
  }];

  heroImages.value = [''];
}

// ─────────────────────────────────────
// Lifecycle Hooks
// ─────────────────────────────────────
onMounted(() => {
  loadCachedPlayers()
})

// ─────────────────────────────────────
// Watchers
// ─────────────────────────────────────
// Save cache whenever players change
watch(
  players,
  () => {
    window.myAPI.savePlayerCache(JSON.stringify(players.value))
  },
  { deep: true },
)
</script>
