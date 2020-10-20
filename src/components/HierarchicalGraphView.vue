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
      <vis-graph :visData="visData" @select="select" @explode="explode" @request="request" :options="options"/>
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
  openedCommunities?:Array<Array<string>>,
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
          color:"black"
        },
        shape:"dot",
        scaling:{
          min:2,
          max:30,
          label:{
            enabled:true,
            min:5,
            max:15
          }
        }
      }
    }
  }

  get visData () {
    return {
      nodes: this.visualization.nodes,
      edges: this.visualization.edges,
      openedCommunities: this.visualization.openedCommunities
    }
  }

  get path():Array<string>{
    return this.visualization.path || []
  }

  get openedCommunities():Array<string>{
    return this.visualization.openedCommunities || []
  }

  set path(p:Array<string>) {
    this.visualization.path = p
    const req = {
      ...this.visualization,
      openedCommunities:[],
      path:p
    }
    this.$emit('request', req)
  }

  emitClickEvent (obj:any,evName:string,payloadFunction:any){
    if(obj?.nodes.length==0){
      return
    }
    const node = this.visualization.nodes.find(n=> n?.id === obj?.nodes?.[0])
    this.$emit(evName, payloadFunction(node) )
  }

  select(obj:any) {
    this.emitClickEvent(obj,'select',(n)=>n)
  }

  explode(obj:any) {
    console.log("BOOOOM")
    this.emitClickEvent(obj,'request',(node)=>({
      ...this.visualization,
      openedCommunities:[...this.visualization.openedCommunities, node.id]
    }))
  }

  request(obj:any) {
    this.emitClickEvent(obj,'request',(node)=>({
      ...this.visualization,
      path:[ ...this.path, node.name ],
      openedCommunities:[]
    }))
  }
}
</script>

<style>

</style>
