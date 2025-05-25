<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-center gap-4 p-4 "
  >
    <!-- Team Image -->
    <div class="flex justify-between lg:col-span-2 bg-[#1f2937] px-3 h-14 items-center gap-3 text-white">
      <input
        v-if="!team.image"
        type="file"
        class="hidden"
        :ref="(el) => imageRefs[index] = el"
        @change="handleFileChange($event, index, 'image')"
      />
      <span class="text-sm">Team Image</span>
      <div v-if="team.image" class="w-12 h-12 ">
        <img :src="team.image" alt="Team" class="w-full h-full object-cover" />
      </div>
      <button
        v-else
        class="text-green-400 font-semibold cursor-pointer"
        @click="() => triggerFileInput(imageRefs, index)"
      >
        + ADD
      </button>
    </div>

    <!-- Team Flag -->
    <div class="flex justify-between lg:col-span-2 bg-[#1f2937] px-4 h-14 items-center gap-3 text-white">
      <input
        v-if="!team.flag"
        type="file"
        class="hidden"
        :ref="(el) => flagRefs[index] = el"
        @change="handleFileChange($event, index, 'flag')"
      />
      <span class="text-sm">Team Flag</span>
      <div v-if="team.flag" class="w-12 h-12  overflow-hidden">
        <img :src="team.flag" alt="Flag" class="w-full h-full object-cover" />
      </div>
      <button
        v-else
        class="text-green-400 font-semibold cursor-pointer"
        @click="() => triggerFileInput(flagRefs, index)"
      >
        + ADD
      </button>
    </div>

    <!-- Team Name -->
    <div class="text-white px-4 py-3 border relative">
      <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
      <input
        type="text"
        v-model="team.name"
        maxlength="13"
        placeholder="Team Name"
        class="outline-hidden pl-5 w-full  placeholder-white placeholder-opacity-100"
      />
    </div>

    <!-- Team Score -->
    <div class="text-white px-4 py-3 border relative">
      <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
      <input
        type="number"
        v-model.number="team.score"
        placeholder="Team Score"
        class="outline-hidden pl-5 w-full placeholder-white placeholder-opacity-100"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  team: Object,
  index: Number,
  imageRefs: Array,
  flagRefs: Array,
  handleFileChange: Function,
  triggerFileInput: Function,
});
</script>
