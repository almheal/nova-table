<template>
  <div class="app-field">
    <input
      class="app-field__input"
      type="text"
      data-test="input"
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
    width: 100%;
    padding: 0 16px;
    font-size: 1em;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    height: 44px;

    @media (max-width: 769px) {
      height: 40px;
    }
  }
}
</style>
