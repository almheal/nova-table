<template>
  <div class="app-dropdown" :class="{ 'is-open': isOpen }">
    <div
      class="app-dropdown__placeholder"
      @click="toggleItems"
      data-test="placeholder"
    >
      {{ toShow(modelValue) || placeholder }}
      <chevron-down-icon class="app-dropdown__arrow" />
    </div>
    <transition name="toggle" duration="200">
      <ul class="app-dropdown__list" v-if="isOpen" data-test="list">
        <li
          class="app-dropdown__item"
          v-for="(item, index) in showedItems"
          :key="index"
          data-test="item"
          @click="selectHandler(item)"
        >
          {{ toShow(item) }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { ChevronDownIcon } from "@/components/icons";

export default {
  name: "AppDropdown",

  components: {
    ChevronDownIcon,
  },

  emits: ["update:modelValue"],

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [Object, String],
      default: "",
    },
    toShow: {
      type: Function,
      default: (item) => item,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    isOpen: false,
  }),

  computed: {
    showedItems() {
      return this.items.filter(
        (item) => this.toShow(item) !== this.toShow(this.modelValue)
      );
    },
  },

  methods: {
    selectHandler(item) {
      this.$emit("update:modelValue", item);
      this.isOpen = false;
    },

    toggleItems() {
      if (!this.showedItems.length) {
        return;
      }

      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-dropdown {
  position: relative;

  &.is-open {
    .app-dropdown__arrow {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  &__placeholder {
    @include flex-align-center;
    position: relative;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    padding: 0 35px 0 16px;
    height: 44px;
    min-width: 150px;
    cursor: pointer;
  }

  &__arrow {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 20px;
    transform: translateY(-50%);
    transition: transform 0.3s;
  }

  &__list {
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    z-index: 50;
    width: 100%;
    background-color: #fff;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(41, 44, 51, 0.2);
  }

  &__item {
    padding: 13px 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f6f6f6;
    }
  }

  .toggle-enter-active,
  .toggle-leave-active {
    transition: 0.2s ease;
  }

  .toggle-enter-from,
  .toggle-leave-to {
    top: 50%;
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
