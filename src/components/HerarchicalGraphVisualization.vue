<template>
  <div class="fit">
    <vis-graph 
      :visData="visData" 
      @select="select" 
      @explode="explode" 
      @open="open" 
      :options="options" 
      ref="visGraph"
      :currentNode="visualization.parents[visualization.parents.length-1].id"
      @list="list"
    />
    <div class="absolute-top text-center q-ma-md" v-if="title">
      <span class="text-body-1">Colored clustering: </span>
      <span class="text-h6">{{title}}</span>
    </div>
    <list-content-dialog :information="popupInformation"/>
  </div>
</template>

<script lang="ts">
import { Options } from "vis-network";
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisGraph from 'components/VisGraph.vue'
import ListContentDialog from 'components/ListContentDialog.vue'
import PathNavigator from 'components/PathNavigator.vue'
type Node={
  id:string,
  name:string
}
@Component({
  components:{
    VisGraph,
    ListContentDialog
  }
})
export default class HierarchicalGraphVisualization extends Vue {
  @Prop({ required: true}) visualization!:any
  @Prop({ required: true}) nodes!:any[]
  @Prop({ required: true}) edges!:any[]
  @Prop({ required: true}) openedCommunities!:any[]
  @Prop({ required: false}) popupInformation!:any
  @Prop({ required: false}) title!:string|undefined

  get options ():Options {
    return {
      /*
      physics:{
        enabled:false
      },
      layout:{
        hierarchical:{
          enabled:true,
          sortMethod:'directed'
        }
      },
      */
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
      },
      edges:{
        smooth:{
          type:'continuous'
        }
      }
    }
  }

  getNetwork(){
    return this.$refs["visGraph"].getNetwork()
  }

  get visData () {
    return {
      nodes: this.nodes,
      edges: this.edges,
      openedCommunities: this.openedCommunities
    }
  }

  emitClickEvent (id:string,evName:string,payloadFunction:(n:Node)=>object){
    const node = this.nodes.find(n=> n?.id === id)
    console.log("Clicked: %s, emitting %s", node,evName)
    console.log(node)
    if ( node ) {
      this.$emit(evName, payloadFunction(node) )
    }
  }

  select(obj:any) {
    this.emitClickEvent(obj,'select',(n)=>n)
  }

  explode(obj:any) {
    console.log("BOOOOM")
    this.emitClickEvent(obj,'request',(node)=>({
      ...this.visualization,
      openedCommunities:[...this.openedCommunities, node.id]
    }))
  }

  open(obj:any) {
    this.emitClickEvent(obj,'request',(node)=>({
      ...this.visualization,
      root:node.id,
      openedCommunities:[]
    }))
  }

  list(node:string){
    console.log("EVENTO LIST EN HIERARCHICAL!!!")
    console.log("EVENTO LIST EN HIERARCHICAL!!!")
    console.log("EVENTO LIST EN HIERARCHICAL!!!")
    console.log("EVENTO LIST EN HIERARCHICAL!!!")
    this.$emit('list', node)
    console.log("post-EVENTO LIST EN HIERARCHICAL!!!")
  }
}
</script>

<style>

</style>
