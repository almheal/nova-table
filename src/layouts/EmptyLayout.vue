<template>
  <div class="layout">
    <router-view class="layout__body" />
  </div>
</template>

<script>
export default {
  name: "EmptyLayout",
};
</script>

<style lang="scss" scoped>
.layout {
  background-image: linear-gradient(45deg, #4158d0, #c850c0);
  min-height: 100vh;
  padding: 30px 0;

  &__body {
    width: 100%;
  }
}
</style>
