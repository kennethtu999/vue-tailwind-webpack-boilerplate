<template>
  <div :class="{ dark: isDarkModeActive }">
    <div class="flex flex-row h-screen antialiased text-gray-800">
      <Sidebar @toggle-dark-mode="isDarkModeActive = !isDarkModeActive" />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  data() {
    return {
      isDarkModeActive: false,
    };
  },
  components: {
    Chat,
    Sidebar,
  },
};
</script>