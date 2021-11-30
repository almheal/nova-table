<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr class="table__header">
          <th
            class="table__head"
            v-for="(column, index) in columns"
            :key="index"
            data-test="column"
          >
            {{ column.value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="table__row"
          v-for="(row, index) in tableRows"
          :key="index"
          data-test="row"
        >
          <td
            class="table__cell"
            v-for="(cell, key, i) in row.cells"
            :key="i"
            :data-id="key"
            data-test="cell"
          >
            {{ cell.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AppTable",

  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: [String, Number],
      default: "",
    },
    activePage: {
      type: [String, Number],
      default: "",
    },
  },

  computed: {
    tableRows() {
      if (!this.limit || !this.activePage) {
        return this.rows;
      }

      // обрезание массива если имеется limit и active page
      return this.rows.slice(
        this.limit * this.activePage - this.limit,
        this.limit * this.activePage
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  &-wrapper {
    overflow-x: auto;
  }

  &__head {
    font-size: 1.14em;
    font-weight: 500;
    color: #8898aa;
    text-align: left;
    border-top: 1px solid #e9ecef;
  }

  &__head,
  &__cell {
    border-bottom: 1px solid #e9ecef;
    padding: 16px 24px;

    @media (max-width: 576px) {
      padding: 16px 8px;
    }
  }
}
</style>
