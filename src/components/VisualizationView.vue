<template>
  <div v-if="visualization.id" class="full-height overflow-hidden" >
      <treemap-view
        v-if="visualization.visualizationType=='treemap'"
        class="full-height"
        :visualization="visualization"
        v-on:request="request"
        v-on:select="select"
      />
      <histogram-view
        v-if="visualization.visualizationType=='histogram'"
        class="full-height"
        :visualization="visualization"
      />
      <hierarchical-graph-view
        v-if="visualization.visualizationType=='hierarchical'"
        class="full-height"
        :visualization="visualization"
      />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TreemapView from 'components/TreemapView.vue'
import HistogramView from 'components/HistogramView.vue'
import HierarchicalGraphView from 'components/HierarchicalGraphView.vue'
@Component({
  components: {
    TreemapView,
    HistogramView,
    HierarchicalGraphView
  }
})
export default class VisualizationView extends Vue {
  get visualization () {
    return this.$store.state.other.visualization
  }

  select(data:any){
    this.$store.dispatch('data/selectObject', data)
  }

  request(visualization:Record<string, string>){
    this.$store.dispatch('data/showVisualization', visualization)
  }
}
</script>

<style>

</style>