<template>
  <div class="app-field">
    <input
      class="app-field__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "AppField",

  emits: ["update:modelValue"],

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.app-field {
  &__input {
    padding: 0 16px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    height: 44px;
  }
}
</style>
