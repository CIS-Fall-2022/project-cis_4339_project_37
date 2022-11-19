<template>
  <main class="">
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome!</h1>
      <p class="font-bold text-2xl tracking-widest text-center mt-10">Events within last 2 months</p>
    </div>
    
    <div
      class="flex justify-around gap-x-3 p-5"
      style="height:70vh"
    >

      <b-card class="flex-grow">
        <bar-chart :events-data=events></bar-chart>
      </b-card>

      <b-card class="flex-grow overflow-auto">
        <b-table :rows="events"></b-table>
      </b-card>

    </div>
    <!-- <line-chart></line-chart> -->
  </main>
</template>
<script>
import barChart from './charts/barChart.vue'
import bTable from './BTable.vue'
import bCard from './BCard.vue'
import axios from 'axios';
export default {
  components: { barChart, bTable, bCard },
  data () {
    return {
      events: [
      ],
      queryData: [],
    }
  },
  methods: {
    routePush (routeName) {
      this.$router.push({ name: routeName });
    },
    async getEventdata() {
      let apiURL = "";
      let d;
      apiURL =
          import.meta.env.VITE_ROOT_API +
          `/eventdata/ptmevents`;
   
      await axios.get(apiURL).then((resp) => {
        this.queryData = resp.data
        console.log(this.queryData,'testsdatas')
      });
      this.generateTableData()
    },
    generateTableData () {
      console.log(this.queryData,'test')
      for (let i = 0; i < this.queryData.length - 1; i++) {
        let data = {EventName: this.queryData[i]?.eventName, Date: (new Date(this.queryData[i]?.date)).toISOString().split('T')[0], Description: this.queryData[i]?.description, Attendees: this.queryData[i]?.attendees?.length}
        this.events.push(data)
      }
      console.log(this.events,'evn')
    }
  },
  created () {
    this.getEventdata()
  }
};
</script>
