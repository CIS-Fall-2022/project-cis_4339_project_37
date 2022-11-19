<template>
  <select v-model="month">
    <option
      v-for="month,index of months"
      :key="index"
      :value="month.value"
    >{{month.label}}</option>
  </select>

</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import moment from 'moment'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data () {
    return {
      months: [],
      month: null
    }
  },
  props: ['eventsData'],
  computed: {
    chartData () {
      return {
        labels: this.datesInMonth.map(date => moment(date).format('D')),
        datasets: this.datasets
      }
    },
    datasets () {
      let datasets = []
      console.log('data',this.eventsData)
      if (this.datesInMonth.length > 0) {
        datasets = [{
          label: 'event',
          data: this.datesInMonth.map((date) => {
            console.log(date)
            return this.eventsData.filter(e => moment(e.date).format('YYYY-MM-DD') === date).reduce((sum, event) => {
              return sum += event.attendees
            }, 0)
          })
        }]
      }
      return datasets

    },
    datesInMonth () {
      let dates = []
      if (!this.month) {
        return dates
      }
      let days = moment().month(this.month).daysInMonth()
      let firstDate = moment().date(1).month(this.month)
      dates.push(firstDate.clone().format('YYYY-MM-DD'))
      for (let i = 1; i < days; i++) {
        dates.push(firstDate.clone().add(i, 'days').format('YYYY-MM-DD'))
      }
      return dates
    }
  },
  methods: {
    generateMonths () {
      for (let i = 1; i < 13; i++) {
        this.months.push({ label: moment().month(i).format('MMMM'), value: i })
      }
    }
  },
  created () {
    this.generateMonths()
  }
}
</script>