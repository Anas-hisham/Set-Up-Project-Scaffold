<template>
  <div class="mt-10">
    <h3 :class="['text-xl font-bold mb-4', displayMode === 'light' ? 'text-black' : 'text-white']">
      Manage Presets
    </h3>

    <div class="flex gap-2 mb-4">
      <input
        :value="newPresetName"
        @input="onNewPresetNameChange($event.target.value)"
        type="text"
        placeholder="New preset name"
        class="flex-grow p-2 rounded border"
        :class="
          displayMode === 'dark'
            ? 'bg-gray-900 text-white border-gray-600'
            : 'bg-white text-gray-900 border-gray-300'
        "
      />
      <button
        @click="onSavePreset"
        class="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded shadow transition"
      >
        Save Current
      </button>
    </div>

    <div class="py-6 pb-2 space-y-4">
      <div
        v-for="(preset, index) in presetList"
        :key="index"
        class="border-b pb-4 last:border-none"
        :class="displayMode === 'dark' ? 'border-gray-700' : 'border-gray-200'"
      >
        <!-- Preset name and action buttons -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <template v-if="editingName === preset.name">
              <input
                :value="editedPresetName"
                @input="onEditedPresetNameChange($event.target.value)"
                class="p-1 rounded border text-sm"
                :class="
                  displayMode === 'dark'
                    ? 'bg-gray-900 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                "
              />
              <button
                @click="onConfirmRename(preset.name)"
                class="text-sm text-green-600 font-semibold"
              >
                ✔️
              </button>
              <button @click="onCancelRename" class="text-sm text-red-600 font-semibold">❌</button>
            </template>
            <template v-else>
              <button
                @click="onApplyPreset(preset.name)"
                class="px-3 py-1 rounded font-medium transition bg-orange-500 hover:bg-orange-600 text-white text-sm shadow"
              >
                {{ preset.name }}
              </button>
            </template>
          </div>

          <!-- Control buttons including Save/Cancel if updating -->
          <div class="flex gap-2">
            <button
              @click="onStartRenaming(preset.name)"
              class="text-sm px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow"
            >
              Edit
            </button>

            <template v-if="updatingPreset === preset.name">
              <button
                @click="onConfirmUpdatePreset(preset.name)"
                class="text-sm px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white shadow"
              >
                Save
              </button>
              <button
                @click="onCancelUpdatePreset"
                class="text-sm px-2 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white shadow"
              >
                Cancel
              </button>
            </template>
            <template v-else>
              <button
                @click="onStartUpdatingPreset(preset)"
                class="text-sm px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white shadow"
              >
                Update
              </button>
            </template>

            <button
              @click="onDeletePreset(preset.name, index)"
              class="text-sm px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white shadow"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Toggle switches shown only during update -->
        <div
          v-if="updatingPreset === preset.name"
          class="mt-4 pl-2 space-y-2 border-l-2"
          :class="displayMode === 'dark' ? 'border-gray-700' : 'border-gray-300'"
        >
          <template v-for="(view, i) in tempUpdatedViews" :key="i">
            <div v-if="view.title !== 'Settings'" class="flex items-center justify-between">
              <span :class="['font-medium', displayMode === 'light' ? 'text-black' : 'text-white']">
                {{ view.title }}
              </span>
              <input
                type="checkbox"
                :checked="view.visible"
                class="w-5 h-5"
                @change="onToggleView(i, $event)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    displayMode: {
      type: String,
      required: true,
    },
    newPresetName: {
      type: String,
      required: true,
    },
    presetList: {
      type: Array,
      required: true,
    },
    editingName: {
      type: String,
      default: '',
    },
    editedPresetName: {
      type: String,
      default: '',
    },
    updatingPreset: {
      type: String,
      default: '',
    },
    tempUpdatedViews: {
      type: Array,
      default: () => [],
    },
    onNewPresetNameChange: {
      type: Function,
      required: true,
    },
    onSavePreset: {
      type: Function,
      required: true,
    },
    onApplyPreset: {
      type: Function,
      required: true,
    },
    onStartRenaming: {
      type: Function,
      required: true,
    },
    onConfirmRename: {
      type: Function,
      required: true,
    },
    onCancelRename: {
      type: Function,
      required: true,
    },
    onStartUpdatingPreset: {
      type: Function,
      required: true,
    },
    onConfirmUpdatePreset: {
      type: Function,
      required: true,
    },
    onCancelUpdatePreset: {
      type: Function,
      required: true,
    },
    onDeletePreset: {
      type: Function,
      required: true,
    },
    onToggleView: {
      type: Function,
      required: true,
    },
    onEditedPresetNameChange: {
      type: Function,
      required: true,
    },
  },
}
</script>
