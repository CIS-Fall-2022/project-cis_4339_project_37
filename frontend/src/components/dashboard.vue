<template>
  <main class="bg-gray-100">
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
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
import { faker } from '@faker-js/faker';
import moment from 'moment'
export default {
  components: { barChart, bTable, bCard },
  data () {
    return {
      events: [
      ]
    }
  },
  methods: {
    routePush (routeName) {
      this.$router.push({ name: routeName });
    },
    createRandomEvent () {
      return {
        eventName: faker.internet.userName(),
        date: moment(faker.date.between('2022-09-01T00:00:00.000Z', '2022-11-30T00:00:00.000Z')).format('YYYY-MM-DD'),
        description: faker.company.bs(),
        attendees: faker.random.numeric(2)
      }
    },
    generateRandomData () {
      for (let i = 0; i < 100; i++) {
        let data = { id: i, ...this.createRandomEvent() }
        this.events.push(data)
      }
    }
  },
  created () {
    this.generateRandomData()
  }
};
</script>
