<template>
  <div class="q-pa-md">
    <canvas ref="visualization"/>
  </div>
</template>

<script lang="ts">
import ChartJS from 'chart.js'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { currentMetricName } from './Utils'

const data = new Map<HistogramView, ChartJS|null>()
type VisualizationType = { bars:{min:number, max:number, y:number}[] }
@Component({})
export default class HistogramView extends Vue {
  @Prop({ required: true, type: Object }) visualization!:VisualizationType

  created () {
    data.set(this, null)
  }

  makeGraph2D (visuRef:HTMLCanvasElement):ChartJS {
    let metricName = currentMetricName(this.visualization);
    return new ChartJS(visuRef, {
      type: 'bar',
      data: {
        labels: this.visualization.bars.map(b => {
          if (b.max - b.min === 1) {
            return b.max.toString()
          } else if (b.min === b.max) {
            return b.min
          } else {
            return `${Math.floor(b.min)}-${Math.floor(b.max)}`
          }
        }),
        datasets: [{
          data: this.visualization.bars.map(({ min, y }) => ({ x: min, y })),
          backgroundColor: '#1976D2',
          borderColor: '#1976D2',
        }]
      },
      options: {
        tooltips:{
          callbacks:{
            title:(item,data)=>`"${metricName}" in the range ${item[0].label}`,
            label:(item,data)=>`${item.yLabel} functions`
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel:{
              display:true,
              labelString: metricName,
            }
          }],
          yAxes: [{
            display: true,
            type: 'logarithmic',
            scaleLabel:{
              display:true,
              labelString:"Number of functions"
            }
          }]
        }
      }
    })
  }

  updateVisualization () {
    const visuRef = this.$refs['visualization']
    if (visuRef instanceof HTMLCanvasElement) {
      const g:ChartJS|null = data.get(this) || null
      if (g !== null) {
        g.destroy()
      }
      data.set(this, this.makeGraph2D(visuRef))
    } else {
      throw new Error("No visualization div inside VisGraph.")
    }
  }

  @Watch('visualization')
  changeVisualization () {
    this.updateVisualization()
  }

  mounted () {
    this.updateVisualization()
  }

  beforeDestroy () {
    const g:ChartJS|null = data.get(this) || null
    if (g !== null) {
      g.destroy()
    }
  }
}
</script>

<style>

</style>
