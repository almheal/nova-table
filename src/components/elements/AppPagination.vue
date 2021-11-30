<template>
  <div class="app-pagination">
    <button
      class="app-pagination__button"
      data-test="previous"
      :class="{ 'is-disabled': Number(activePage) === 1 }"
      @click="
        changePage(Number(activePage) === 1 ? activePage : activePage - 1)
      "
    >
      <chevron-down-icon
        class="app-pagination__arrow app-pagination__arrow_left"
      />
    </button>

    <button
      class="app-pagination__button"
      v-for="pageNumber in paginationPages"
      :key="pageNumber"
      data-test="button"
      :class="{ 'is-active': Number(pageNumber) === Number(activePage) }"
      @click="changePage(pageNumber)"
    >
      {{ pageNumber }}
    </button>

    <button
      class="app-pagination__button"
      data-test="next"
      :class="{ 'is-disabled': Number(activePage) === pagesLength }"
      @click="
        changePage(
          Number(activePage) === pagesLength
            ? activePage
            : Number(activePage) + 1
        )
      "
    >
      <chevron-down-icon
        class="app-pagination__arrow app-pagination__arrow_right"
      />
    </button>
  </div>
</template>

<script>
import { ChevronDownIcon } from "@/components/icons";

export default {
  name: "AppPagination",

  components: {
    ChevronDownIcon,
  },

  emits: ["changePage"],

  props: {
    limit: {
      type: [String, Number],
      default: 10,
    },
    itemsLength: {
      type: [String, Number],
      default: 0,
    },
    activePage: {
      type: [String, Number],
      default: 1,
    },
    savePage: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    pagesLength() {
      return Math.ceil(this.itemsLength / this.limit) || 1;
    },

    paginationPages() {
      if (this.pagesLength <= 6) {
        return this.pagesLength;
      }

      let pages = [];

      if (this.pagesLength > 6 && this.activePage < 4) {
        for (let i = 1; i < 5; i++) {
          pages.push(i);
        }

        pages.push(this.pagesLength);
      }

      if (this.pagesLength > 6 && this.activePage >= 4) {
        /*
          Вторая страница в пагинации
          Если активная страница меньше (кол-во страниц - 1), возвращаем кол-во страниц - 1
          Иначе возвращаем кол-во страниц - 3
        */
        const secondPage =
          Number(this.activePage) < this.pagesLength - 1
            ? Number(this.activePage) - 1
            : this.pagesLength - 3;

        /*
          Третья страница в пагинации
          Если активная страница меньше (кол-во страниц - 1), возвращаем текущую активную страницу
          Иначе возвращаем кол-во страниц - 2
        */
        const thirdPage =
          Number(this.activePage) < this.pagesLength - 1
            ? Number(this.activePage)
            : this.pagesLength - 2;

        /*
          Четвертая страница в пагинации
          Если активная страница меньше (кол-во страниц - 1), возвращаем текущую активную страницу + 1
          Иначе возвращаем кол-во страниц - 1
        */
        const fourthPage =
          Number(this.activePage) < this.pagesLength - 1
            ? Number(this.activePage) + 1
            : this.pagesLength - 1;

        pages = [1, secondPage, thirdPage, fourthPage, this.pagesLength];
      }

      return pages;
    },
  },

  methods: {
    changePage(pageNumber) {
      if (pageNumber === this.activePage) {
        return;
      }

      // сохранение номера страницы в query
      if (this.savePage) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: pageNumber,
          },
        });
      }

      this.$emit("changePage", pageNumber);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-pagination {
  display: flex;

  &__button {
    position: relative;
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #dee2e6;
    margin-right: 6px;
    color: #8898aa;
    transition: background-color 0.3s;

    @media (max-width: 576px) {
      width: 30px;
      height: 30px;
    }

    &:last-child {
      margin-right: 0;
    }

    &:not(.is-active):not(.is-disabled) {
      &:hover {
        background-color: #dee2e6;
      }
    }

    &.is-disabled {
      opacity: 0.38;
      cursor: default;
    }

    &.is-active {
      background-color: #5e72e4;
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
        0 3px 6px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(94, 114, 228, 0.5);
      color: #fff;
    }
  }

  &__arrow {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;

    &_left {
      transform: translate(-50%, -50%) rotate(90deg);
    }

    &_right {
      transform: translate(-50%, -50%) rotate(-90deg);
    }
  }
}
</style>
