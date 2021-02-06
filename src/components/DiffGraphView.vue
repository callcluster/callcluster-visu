<template>
  <div class="column">
    <q-toolbar>
      <path-navigator :path="path" @change="changeRoot"/>
    </q-toolbar>
    <transition
          mode="out-in"
          enter-active-class="animated zoomIn"
          leave-active-class="animated fadeOut"
          duration="200"
        >
      <div :key="root" class="col">
        <q-splitter
          v-model="splitterModel"
          :limits="[20, 80]"
          class="fit"
        >
        <template v-slot:before>
          <hierarchical-graph-visualization 
            :visualization="visualization" 
            :nodes="visualization.left.nodes"
            :edges="visualization.left.edges"
            :openedCommunities="openedCommunities"
            @select="select"
            @request="request"
            ref="leftNetwork"
            @list="list"
          />
        </template>
        <template v-slot:after>
          <hierarchical-graph-visualization 
            :visualization="visualization" 
            :nodes="visualization.right.nodes"
            :edges="visualization.right.edges"
            :openedCommunities="openedCommunities"
            @select="select"
            @request="request"
            ref="rightNetwork"
            @list="list"
          />
        </template>
        </q-splitter>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Options } from "vis-network";
import { Vue, Component, Prop } from 'vue-property-decorator'
import HierarchicalGraphVisualization from 'components/HerarchicalGraphVisualization.vue'
import PathNavigator from 'components/PathNavigator.vue'
import { LayoutCoordinator } from "./LayoutCoordinator";
type Node={
  id:string,
  name:string
}
type DiffGraphVisualization = {
  left:{
    nodes:Array<Node>,
    edges:Array<object>,
  },
  right:{
    nodes:Array<Node>,
    edges:Array<object>,
  }
  id:number,
  visualizationType:'diff',
  parents?:Array<{ id:string, name:string }>
  openedCommunities?:Array<string>,
  parameters:Record<string, string>,
  root:string
}
@Component({
  components:{
    HierarchicalGraphVisualization,
    PathNavigator
  }
})
export default class DiffGraphView extends Vue {
  splitterModel = 50;
  @Prop() visualization!:DiffGraphVisualization
  layoutCoordinator:LayoutCoordinator

  get path():Array<{ id:string, name:string }>{
    return this.visualization.parents || []
  }

  get openedCommunities():Array<string>{
    return this.visualization.openedCommunities || []
  }

  get leftNetwork(){
    return this.$refs["leftNetwork"].getNetwork()
  }

  get rightNetwork(){
    return this.$refs["rightNetwork"].getNetwork()
  }

  mounted(){
    this.layoutCoordinator=new LayoutCoordinator([this.leftNetwork,this.rightNetwork])
  }

  beforeDestroy(){
    this.layoutCoordinator?.destroy();
  }

  changeRoot(newRoot:string){
    const req = {
      ...this.visualization,
      openedCommunities:[],
      root:newRoot
    }
    this.$emit('request', req)
  }

  select(e:any){
    this.$emit('select', e)
  }

  request(e:any){
    this.$emit('request', e)
  }

  get root():string|null {
    return this.visualization.root??null
  }

  list(node:string){
    this.$emit('list', node)
  }
}
</script>

<style>

</style>
