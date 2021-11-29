<template>
  <table class="table">
    <thead>
      <tr class="table__header">
        <th class="table__head" v-for="(column, index) in columns" :key="index">
          {{ column.value }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="table__row" v-for="(row, index) in rows" :key="index">
        <td class="table__cell" v-for="(cell, i) in row.cells" :key="i">
          {{ cell.value }}
        </td>
      </tr>
    </tbody>
  </table>
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
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  &__head {
    font-size: 16px;
    font-weight: 500;
    color: #8898aa;
    text-align: left;
    border-top: 1px solid #e9ecef;
  }

  &__head,
  &__cell {
    border-bottom: 1px solid #e9ecef;
    padding: 16px 24px;
  }
}
</style>
