<template>
  <div class="home">
    <div class="container">
      <div class="home__inner">
        <div class="home__body">
          <div class="home__wrapper">
            <div class="home__header">
              <app-dropdown
                class="home__field home__dropdown"
                placeholder="Колонка"
                data-test="column-filter"
                :items="filterColumnList"
                :toShow="(column) => column.value"
                v-model="filter.column"
                @update:modelValue="resetPage"
              />
              <transition-group name="scale" duration="300">
                <app-dropdown
                  v-if="filter.column"
                  data-test="condition-filter"
                  class="home__field home__dropdown"
                  placeholder="Фильтр"
                  :items="conditionFilter"
                  :toShow="(condition) => condition.value"
                  v-model="filter.condition"
                  @update:modelValue="resetPage"
                />
                <app-field
                  class="home__field"
                  v-if="filter.column && filter.condition"
                  data-test="input-filter"
                  placeholder="Значение"
                  v-model="filter.value"
                  @update:modelValue="resetPage"
                />
                <app-button
                  @clickButton="resetFilter"
                  v-if="isFilter"
                  data-test="reset-button"
                  >Сбросить</app-button
                >
              </transition-group>
            </div>
            <app-table
              :columns="columns"
              :rows="filteredItems"
              :limit="LIMIT"
              :activePage="activePage"
            />
            <div
              class="home__empty"
              v-if="!filteredItems.length"
              data-test="empty"
            >
              Список пуст
            </div>
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
import generateTableItems from "@/utils/genericTableItems";

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
  }),

  computed: {
    tableItems() {
      return this.generateTableItems(355);
    },

    activePage() {
      // текущий номер страницы в роуте или в случае отсутствия по дефолту 1
      return this.$route.query.page || 1;
    },

    filterColumnList() {
      // массив колонок без даты
      return this.columns.filter((column) => column.filterProperty !== "date");
    },

    isFilter() {
      // имеется ли хоть один заполненный фильтр
      return Object.values(this.filter).some((item) => item);
    },

    filteredItems() {
      // если не все поля фильтров заполненны, возвращаем дефолтный массив
      if (!Object.values(this.filter).every((filter) => filter)) {
        return this.tableItems;
      }

      // фильтрация массива - filterProperty содержит название поля
      return this.tableItems.filter((item) => {
        return this.filterValue(
          item.cells[this.filter.column.filterProperty].value
        );
      });
    },
  },

  methods: {
    generateTableItems,
    // проверка значения по выбранному фильтру
    filterValue(value) {
      switch (this.filter.condition.filterName) {
        case "equal":
          return (
            this.filter.value.toLowerCase() === String(value).toLowerCase()
          );

        case "contain":
          return String(value)
            .toLowerCase()
            .includes(this.filter.value.toLowerCase());

        case "larger":
          return Number(value) > Number(this.filter.value);

        case "less":
          return Number(value) < Number(this.filter.value);

        default:
          break;
      }
    },

    // сброс всех фильтров
    resetFilter() {
      this.filter = Object.keys(this.filter).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
    },

    resetPage() {
      if (
        Number(this.activePage) === 1 ||
        !this.filter.column ||
        !this.filter.condition
      ) {
        return;
      }
      this.$router.replace({ query: { ...this.$route.query, page: 1 } });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__header {
    display: flex;
    padding: 20px 24px;

    @media (max-width: 624px) {
      flex-wrap: wrap;
    }
  }

  &__body {
    @include flex-space;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }

  &__empty {
    text-align: center;
    padding: 24px 0;
  }

  &__field {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }

    @media (max-width: 624px) {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    @media (max-width: 420px) {
      width: 100%;
      margin-right: 0;
    }
  }

  &__dropdown {
    @media (max-width: 624px) {
      width: calc(50% - 4px);
      margin-right: 0;

      &:nth-child(1) {
        margin-right: 8px;
      }
    }

    @media (max-width: 420px) {
      width: 100%;
      &:nth-child(1) {
        margin-right: 0;
      }
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
