<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
  >
    Players Stats
  </h1>
  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-6">
      <div v-for="(player, index) in players" :key="index" class="grid gap-6 p-4 -lg">
        <!-- Player Name -->
        <div class="grid gap-2">
          <label
            v-if="player.playerName"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Player Name</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="text"
              v-model="player.playerName"
              placeholder="Player Name"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Team Name -->
        <div class="grid gap-2">
          <label
            v-if="player.teamName"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Team Name</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="text"
              v-model="player.teamName"
              placeholder="Team Name"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Favorite Weapon -->
        <div class="grid gap-2">
          <label
            v-if="player.favouriteWeapon"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Favorite Weapon</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="text"
              v-model="player.favouriteWeapon"
              placeholder="Favorite Weapon"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Economy Score -->
        <div class="grid gap-2">
          <label
            v-if="player.economyScore >= 0 && player.economyScore !== ''"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Economy Score</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="number"
              min="0"
              v-model.number="player.economyScore"
              placeholder="Economy Score"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Hero Image Section remains the same -->
        <div class="grid gap-2">
          <div
            class="flex justify-between border px-4 h-14 items-center gap-3"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <span class="text-sm opacity-65">Hero Image</span>
            <div v-if="heroImages[index]" class="flex items-center gap-2">
              <img
                :src="heroImages[index]"
                alt="Hero"
                class="w-12 h-12 object-cover cursor-pointer "
                @click="openHeroImageDialog(index)"
                title="Click to change image"
              />
              <button
                type="button"
                class="text-red-500 font-semibold hover:underline"
                @click="removeHeroImage(index)"
                title="Delete image"
              >
                Delete
              </button>
            </div>
            <button
              v-else
              class="font-semibold cursor-pointer"
              :class="props.displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
              @click="openHeroImageDialog(index)"
            >
              + ADD
            </button>
          </div>
        </div>

        <!-- Kills -->
        <div class="grid gap-2">
          <label
            v-if="player.Kills >= 0 && player.Kills !== ''"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Kills</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="number"
              min="0"
              v-model.number="player.Kills"
              placeholder="Kills"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Deaths -->
        <div class="grid gap-2">
          <label
            v-if="player.Deaths >= 0 && player.Deaths !== ''"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Deaths</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="number"
              min="0"
              v-model.number="player.Deaths"
              placeholder="Deaths"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>

        <!-- Assists -->
        <div class="grid gap-2">
          <label
            v-if="player.Assists >= 0 && player.Assists !== ''"
            class="text-sm font-semibold"
            :class="[props.displayMode === 'dark' ? 'text-white' : 'text-black']"
            >Assists</label
          >
          <div
            class="px-4 py-3 border relative"
            :class="
              props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
            "
          >
            <i
              class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
              :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
            ></i>
            <input
              type="number"
              min="0"
              v-model.number="player.Assists"
              placeholder="Assists"
              class="outline-hidden pl-5 w-full bg-transparent"
              :class="
                props.displayMode === 'dark'
                  ? 'placeholder-white text-white'
                  : 'placeholder-black text-black'
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center mt-3">
    <button
      @click="savePlayers"
      class="px-6 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold"
    >
      Save Players
    </button>
  </div>

  <div
    v-if="alert.showAlert"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeAlert"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-80 text-center"
      :class="[props.displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
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
// ─────────────────────────────────────
// ✅ Imports
// ─────────────────────────────────────
import { ref, reactive, watch, onMounted } from 'vue'

// ─────────────────────────────────────
// ✅ Props
// ─────────────────────────────────────
const props = defineProps({
  displayMode: {
    type: String,
    default: 'light',
  },
})

// ─────────────────────────────────────
// ✅ Reactive State
// ─────────────────────────────────────

// Players data list
const players = ref([
  {
    playerName: '',
    teamName: '',
    favouriteWeapon: '',
    economyScore: '',
    heroImage: '',
    Kills: '',
    Deaths: '',
    Assists: '',
  },
])

// Hero image preview URLs
const heroImages = ref([''])

// Alert box data
const alert = reactive({
  showAlert: false,
  text: '',
})

// ─────────────────────────────────────
// ✅ Alert Handlers
// ─────────────────────────────────────

// Show alert with custom message
function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

// Close alert box
function closeAlert() {
  alert.showAlert = false
}

// ─────────────────────────────────────
// ✅ Image Handling
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

      window.myAPI.readFile(imagePath).then((fileData) => {
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
// ✅ Save & Load Players
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
// ✅ Lifecycle Hooks
// ─────────────────────────────────────
onMounted(() => {
  loadCachedPlayers()
})

// ─────────────────────────────────────
// ✅ Watchers
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
