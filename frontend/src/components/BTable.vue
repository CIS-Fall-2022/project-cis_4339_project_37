<template>
  <table class="table-auto border-collapse" style="width:618px">
    <thead class="sticky top-0 bg-red-100">
      <tr>
        <td
          class="p-2"
          v-for="column,index of columns"
          :key="index"
        >{{column.toUpperCase()}}</td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row,index of rows"
        :key="index"
      >
        <td
          class="p-2 border-t border-gray-400"
          v-for="value,field of row"
          :key="field"
        >
          {{value}}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'BTable',
  props: ['rows'],
  computed: {
    columns () {
      let columns = []
      if (this.rows.length > 1) {
        let dataColumns = Object.keys(this.rows[0])
        columns = dataColumns
      }
      console.log(columns)
      return columns
    }
  }
}
</script>
