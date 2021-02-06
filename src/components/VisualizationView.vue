<template>
  <div class="full-height overflow-hidden column">
    <q-toolbar>
      <q-toolbar-title v-if="visualization && visualization.parameters" v-html="description" class="text-grey-8"></q-toolbar-title>
      <q-toolbar-title v-else class="text-grey-6">No visualization selected</q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <div v-if="visualization.id" class="col" >
        <treemap-view
          v-if="visualization.visualizationType=='treemap' || visualization.visualizationType=='treemap-colored'"
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
          v-if="visualization.visualizationType=='hierarchical' || visualization.visualizationType=='hierarchical-colored'"
          class="full-height"
          :visualization="visualization"
          v-on:request="request"
          v-on:select="select"
          v-on:list="list"
          :popupInformation="listContents"
        />
        <diff-graph-view
          v-if="visualization.visualizationType=='diff'"
          class="full-height"
          :key="JSON.stringify(visualization.parents)"
          :visualization="visualization"
          v-on:request="request"
          v-on:select="select"
          v-on:list="list"
          :popupInformation="listContents"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TreemapView from 'components/TreemapView.vue'
import HistogramView from 'components/HistogramView.vue'
import DiffGraphView from 'components/DiffGraphView.vue'
import HierarchicalGraphView from 'components/HierarchicalGraphView.vue'
import { descriptionOfVisualization } from "./Utils";
@Component({
  components: {
    TreemapView,
    HistogramView,
    HierarchicalGraphView,
    DiffGraphView
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

  get description(){
    if(this.visualization && this.visualization.parameters){
      return descriptionOfVisualization(this.visualization)
    } else{
      return "";
    }
  }

  get listContents(){
    return this.$store.state.other.listContents
  }

  list(node:string){
    this.$store.dispatch('other/getListContents', {
      node,
      coloringParameters:this.visualization.coloringParameters,
      parameters:this.visualization.parameters
    })
  }
}
</script>

<style>

</style>