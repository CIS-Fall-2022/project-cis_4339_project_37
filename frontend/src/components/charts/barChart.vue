<template>

  <Bar
    :chart-data="chartData"
    :chart-options="chartOptions"
    style="position:relative;width:65vw;height:30vw"
  />

</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data () {
    return {
      months: [],
      month: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      
      }
    }
  },
  props: ['eventsData'],
  computed: {
    chartData () {
      console.log(this.eventsData,'tts')
      return {
        labels: this.eventsData.map(e => e.EventName),
        datasets: [
          {
            label: 'attendees',
            backgroundColor: '#f87979',
            data: this.eventsData.map((e) => {
              return e.Attendees
            })
          }
        ]

      }
    },

  },
}
</script>