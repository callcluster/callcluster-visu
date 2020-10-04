<template>
<div class="column">
  <q-toolbar>
    <path-navigator v-model="path"/>
  </q-toolbar>
  <transition
        mode="out-in"
        enter-active-class="animated zoomIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
    <div :key="JSON.stringify(path)" class="col">
      <vis-graph :visData="visData" @select="select" @request="request" :options="options"/>
    </div>
  </transition>
</div>
</template>

<script lang="ts">
import { Options } from "vis-network";
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisGraph from 'components/VisGraph.vue'
import PathNavigator from 'components/PathNavigator.vue'
type HierarchicalGraphVisualization = {
  nodes:Array<object>,
  edges:Array<object>,
  id:number,
  visualizationType:'hierarchical',
  path?:Array<string>,
  parameters:Record<string, string>
}
@Component({
  components:{
    VisGraph,
    PathNavigator
  }
})
export default class HierarchicalGraphView extends Vue {
  @Prop() visualization!:HierarchicalGraphVisualization

  get options ():Options {
    return {
      nodes:{
        color:{
          highlight:{
            background:"#26A69A",
            border:"#26A69A"
          },
          border:"#1976D2",
          background:"#1976D2"
        },
        font:{
          color:"white"
        }
      }
    }
  }

  get visData () {
    return {
      nodes: this.visualization.nodes,
      edges: this.visualization.edges
    }
  }

  get path():Array<string>{
    return this.visualization.path || []
  }

  set path(p:Array<string>) {
    this.visualization.path = p
    const req = {
      ...this.visualization,
      path:p
    }
    this.$emit('request', req)
  }

  select(obj:any) {
    if(obj?.nodes.length==0){
      return
    }
    this.$emit('select', this.visualization.nodes.find(n=> n?.id === obj?.nodes?.[0]) )
  }

  request(obj:any) {
    let node = this.visualization.nodes.find(n=> n?.id === obj?.nodes?.[0])
    if(!node){
      return
    }
    if (node.type === 'function') {
      return
    }
    this.$emit('request', {
      ...this.visualization,
      path:[ ...this.path, node.name]
    })
  }
}
</script>

<style>

</style>
