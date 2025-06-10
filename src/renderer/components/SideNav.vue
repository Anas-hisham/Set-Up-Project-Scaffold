<!-- src/components/SideNav.vue -->
<template>
  <nav
    :class="[
      'side-nav transition-all duration-300 flex flex-col border-r',
      displayMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200',
    ]"
  >
    <div class="flex justify-center items-center h-[calc(100vh-60px)]">
      <ul class="space-y-2 p-2 w-fit">
        <li v-for="view in views" :key="view.path">
          <router-link
            :to="view.path"
            :class="[
              'flex items-center p-2 rounded-lg transition-colors',
              navMode === 'full' ? 'justify-start' : 'justify-center',
              displayMode === 'dark' ? ' text-white' : ' text-gray-900',
              $route.path === view.path
                ? displayMode === 'dark'
                  ? 'bg-blue-600'
                  : 'bg-blue-600'
                : '',
            ]"
            :title="navMode === 'mini' ? view.title : ''"
          >
            <span v-if="navMode === 'full'" class="">{{ view.title }}</span>
            <span v-else class="font-bold">{{ getFirstLetter(view.title) }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  views: Array,
  navMode: String,
  displayMode: String,
})

const getFirstLetter = (title) => {
  return title && title.length > 0 ? title.charAt(0) : '?'
}
</script>
