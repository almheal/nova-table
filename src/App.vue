<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout";

export default {
  name: "App",

  components: {
    EmptyLayout,
  },

  computed: {
    layout() {
      return this.$route.meta.layout;
    },
  },
};
</script>

<style lang="scss">
@import "./assets/styles/index.scss";
</style>
