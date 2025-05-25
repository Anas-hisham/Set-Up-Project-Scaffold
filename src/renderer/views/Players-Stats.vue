<template>
  <h1 class="mt-12 text-4xl font-bold text-center text-white">Player Stats</h1>
  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-4">
      <div v-for="(player, index) in players" :key="index" class="grid gap-7 p-4 -lg">
        <!-- Player Name -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            v-model="player.name"
            placeholder="Player Name"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100 "
          />
        </div>

        <!-- Team Name -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            v-model="player.team"
            placeholder="Team Name"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Favorite Weapon -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            v-model="player.weapon"
            placeholder="Favorite Weapon"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Economy Score -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="number"
            v-model.number="player.economy"
            placeholder="Economy Score"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Hero Image -->
        <div
          class="flex justify-between bg-transparent border px-4 h-14 items-center gap-3 text-white"
        >
          <input
            v-if="!player.hero"
            type="file"
            class="hidden"
            :ref="(el) => (heroRefs[index] = el)"
            @change="handleFileChange($event, index, 'hero')"
          />
          <span class="text-sm opacity-65">Hero Image</span>
          <div v-if="player.hero" class="w-12 h-12">
            <img :src="player.hero" alt="Hero" class="w-full h-full object-cover" />
          </div>
          <button
            v-else
            class="text-green-400 font-semibold cursor-pointer"
            @click="() => triggerFileInput(heroRefs, index)"
          >
            + ADD
          </button>
        </div>

        <!-- Kills -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="number"
            v-model.number="player.kills"
            placeholder="Kills"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Deaths -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="number"
            v-model.number="player.deaths"
            placeholder="Deaths"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>

        <!-- Assists -->
        <div class="text-white px-4 py-3 border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="number"
            v-model.number="player.assists"
            placeholder="Assists"
            class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const players = ref([
  {
    name: '',
    team: '',
    weapon: '',
    economy: null,
    hero: null,
    kills: null,
    deaths: null,
    assists: null,
  },
])

const heroRefs = ref([])

function triggerFileInput(refs, index) {
  if (refs[index]) {
    refs[index].click()
  }
}

function handleFileChange(event, index, type) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      players.value[index][type] = reader.result
    }
    reader.readAsDataURL(file)
  }
}
</script>
