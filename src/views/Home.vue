<template>
  <div class="home">
    <div class="container">
      <div class="home__inner">
        <div class="home__body">
          <div class="home__table">
            <div class="home__header">
              <app-dropdown
                class="home__field"
                placeholder="Колонка"
                :items="filterColumnList"
                :toShow="(column) => column.value"
                v-model="filter.column"
              />
              <transition-group name="scale" duration="300">
                <app-dropdown
                  v-if="filter.column"
                  class="home__field"
                  placeholder="Фильтр"
                  :items="conditionFilter"
                  :toShow="(condition) => condition.value"
                  v-model="filter.condition"
                />
                <app-field
                  class="home__field"
                  v-if="filter.column && filter.condition"
                  placeholder="Значение"
                  v-model="filter.value"
                />
                <app-button @clickButton="resetFilter" v-if="isFilter"
                  >Сбросить</app-button
                >
              </transition-group>
            </div>
            <app-table :columns="columns" :rows="slicedItems" />
          </div>

          <div class="home__pagination">
            <app-pagination
              :itemsLength="filteredItems.length"
              :limit="LIMIT"
              :activePage="activePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppTable from "@/components/elements/AppTable";
import AppDropdown from "@/components/elements/AppDropdown";
import AppField from "@/components/elements/AppField";
import AppButton from "@/components/elements/AppButton";
import AppPagination from "@/components/elements/AppPagination";
import { TABLE_ITEMS } from "@/const";

export default {
  name: "Home",

  components: {
    AppTable,
    AppDropdown,
    AppField,
    AppButton,
    AppPagination,
  },

  data: () => ({
    filter: {
      column: "",
      condition: "",
      value: "",
    },
    conditionFilter: [
      { filterName: "equal", value: "Равно" },
      { filterName: "contain", value: "Содержит" },
      { filterName: "larger", value: "Больше" },
      { filterName: "less", value: "Меньше" },
    ],
    columns: [
      { filterProperty: "date", value: "Дата" },
      { filterProperty: "title", value: "Название" },
      { filterProperty: "count", value: "Количество" },
      { filterProperty: "distance", value: "Расстояние" },
    ],
    LIMIT: 10,
    TABLE_ITEMS,
  }),

  watch: {
    "filter.value"() {
      this.$router.replace({ query: { ...this.$route.query, page: 1 } });
    },
  },

  computed: {
    activePage() {
      return this.$route.query.page || 1;
    },

    filterColumnList() {
      return this.columns.filter((column) => column.filterProperty !== "date");
    },

    isFilter() {
      return Object.values(this.filter).some((item) => item);
    },

    slicedItems() {
      return this.filteredItems.slice(
        this.LIMIT * this.activePage - this.LIMIT,
        this.LIMIT * this.activePage
      );
    },

    filteredItems() {
      if (!Object.values(this.filter).every((filter) => filter)) {
        return this.TABLE_ITEMS;
      }

      return this.TABLE_ITEMS.filter((item) =>
        this.filterItem(item.cells[this.filter.column.filterProperty].value)
      );
    },
  },

  methods: {
    filterItem(value) {
      switch (this.filter.condition.filterName) {
        case "equal":
          return this.filter.value.toLowerCase() === value.toLowerCase();

        case "contain":
          return value.toLowerCase().includes(this.filter.value.toLowerCase());

        case "larger":
          return Number(value) > Number(this.filter.value);

        case "less":
          return Number(value) < Number(this.filter.value);

        default:
          break;
      }
    },

    resetFilter() {
      this.filter = Object.keys(this.filter).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__header {
    display: flex;
    padding: 20px 24px;
  }

  &__body {
    @include flex-space;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }

  &__field {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
  }

  .scale-enter-active,
  .scale-leave-active {
    transition: 0.2s;
  }

  .scale-enter-from,
  .scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
