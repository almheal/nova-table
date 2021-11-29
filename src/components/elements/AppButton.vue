<template>
  <button class="app-button" @click="$emit('clickButton')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "AppButton",

  emits: ["clickButton"],
};
</script>

<style lang="scss" scoped>
.app-button {
  position: relative;
  display: block;
  width: 150px;
  height: 44px;
  padding: 0 16px;
  background-color: #5e72e4;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;

  &::before {
    @include absolute-center;
    content: "";
    width: 0;
    height: 0;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    transition: 0.3s;
  }

  &:hover {
    &::before {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
