<template>
  <div id="app">
    <div>
      <table border="1" v-table-select="state">
        <tr v-for="(rowData, rowIndex) in state.tableData" :key="rowIndex">
          <th>{{ rowData.row }}</th>
          <td
            v-for="(columnData, columnIndex) in rowData.data"
            :key="columnIndex"
            :class="{ selected: columnData.selected }"
            :data-row="rowIndex"
            :data-column="columnIndex"
          >
            {{ columnData.content }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import vTableSelect from './directives/tableSelect';

const data = [
  {
    row: 'X',
    data: [
      {
        id: 1,
        content: 1,
        selected: false,
      },
      {
        id: 2,
        content: 2,
        selected: false,
      },
      {
        id: 3,
        content: 3,
        selected: false,
      },
      {
        id: 4,
        content: 4,
        selected: false,
      },
    ],
  },
  {
    row: 'Y',
    data: [
      {
        id: 5,
        content: 5,
        selected: false,
      },
      {
        id: 6,
        content: 6,
        selected: false,
      },
      {
        id: 7,
        content: 7,
        selected: false,
      },
      {
        id: 8,
        content: 8,
        selected: false,
      },
    ],
  },
  {
    row: 'Z',
    data: [
      {
        id: 9,
        content: 9,
        selected: false,
      },
      {
        id: 10,
        content: 10,
        selected: false,
      },
      {
        id: 11,
        content: 11,
        selected: false,
      },
      {
        id: 12,
        content: 12,
        selected: false,
      },
    ],
  },
];

const state = reactive({
  tableData: data,
  selectedData: null,
  selectedAreaData: [],
});

watch(
  () => state.selectedData,
  (newValue) => {
    // console.log('selectedData:', newValue);
  }
);
watch(
  () => state.selectedAreaData,
  (newValue) => {
    // console.log('selectedAreaData:', selectedAreaData);
  }
);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  user-select: none;
}
table {
  width: 800px;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: center;
}
td {
  position: relative;
  box-sizing: border-box;
  height: 33px;
  cursor: pointer;
}
td.selected {
  background-color: #3f87f533;
}
</style>
