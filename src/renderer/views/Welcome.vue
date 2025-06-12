<template>
  <div class="welcome-container">
    <h1 class="welcome-title">Welcome to Our Stream</h1>
    <!-- <p class="welcome-message">Enjoy the tournament coverage!</p>

    <button @click="openFileDialog" class="select-button">
      Select Tournament Image
    </button>

    <div v-if="selectedImage" class="image-preview">
      <img
        :src="selectedImage"
        alt="Selected Tournament Image"
        class="preview-image"
        @click="openFileDialog"
      >
      <p class="image-path">{{ imagePath }}</p>
      <button @click="removeImage" class="remove-button">
        Remove Image
      </button>
    </div> -->
  </div>
</template>

<script setup>
// import { ref } from 'vue';

// const selectedImage = ref(null);
// const imagePath = ref('');

// const openFileDialog = async () => {
//   try {
//     // Open file dialog and get the selected file path
//     const result = await window.myAPI.openFileDialog({
//       filters: [
//         { name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] }
//       ]
//     });

//     if (!result.canceled && result.filePaths.length > 0) {
//       const path = result.filePaths[0];
//       imagePath.value = path;

//       // Read the file and create a data URL for display
//       const fileData = await window.myAPI.readFile(path);
//       selectedImage.value = URL.createObjectURL(new Blob([fileData]));
//     }
//   } catch (error) {
//     console.error('Error selecting file:', error);
//     window.myAPI.showErrorDialog('Failed to load image');
//   }
// };

// const removeImage = () => {
//   // Revoke the object URL to prevent memory leaks
//   if (selectedImage.value) {
//     URL.revokeObjectURL(selectedImage.value);
//   }
//   selectedImage.value = null;
//   imagePath.value = '';
// };
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.welcome-message {
  font-size: 1.5rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.select-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 2rem;
}

.select-button:hover {
  background-color: #45a049;
}

.image-preview {
  margin-top: 2rem;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.preview-image:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.image-path {
  margin-top: 1rem;
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 0.5rem;
  border-radius: 4px;
  word-break: break-all;
}

.remove-button {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.remove-button:hover {
  background-color: #d32f2f;
}

/* Dark mode support */
.dark .image-path {
  background-color: #2d3748;
  color: #e2e8f0;
}

.dark .preview-image {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.dark .preview-image:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}
</style>
