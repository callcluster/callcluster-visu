<template>
  <div ref="visualization" class="fit"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Network, Options, Data } from "vis-network";
import { VisData } from 'vis-network/declarations/network/gephiParser';
type VisGraphNode = { id:number, label:string, parent:number };
type VisGraphEdge = { from:number, to:number, arrows?:string };
type VisGraphData = { nodes:Array<VisGraphNode>, edges:Array<VisGraphEdge> }

import { Edge, Node } from 'vis-network';
import { DataInterface } from 'vis-data'

interface MutableNetwork {
  body:{
    data:{
      nodes:DataInterface<Node>,
      edges:DataInterface<Edge>,
    }
  }
}

let networks:Map<symbol,Network|null>=new Map<symbol,Network|null>();

interface OpenedCommunitiesData {
  openedCommunities?:Array<number>
}

@Component
export default class VisGraph extends Vue {
  @Prop({ type: Object, required: true }) readonly visData!:VisGraphData ;
  @Prop({ type: Object, required: false, default:()=>({}) }) readonly options!:Options ;
  readonly networkKey:symbol = Symbol();
  created(){
    networks.set(this.networkKey,null)
  }
  mounted(){
    console.log("MOUNTED!!")
    let visuRef = this.$refs["visualization"];
    if(visuRef instanceof HTMLElement){
      let nw = new Network(visuRef,this.visData,this.options)
      networks.set(this.networkKey,nw)
      nw.on('click',(e)=>{
        if (e.event.srcEvent.ctrlKey) {
          this.$emit('explode',e)
        }
      })
      nw.on('selectNode',(e)=>{
        if (!e.event.srcEvent.ctrlKey) {
          this.$emit('select',e)
        }
      })
      nw.on('doubleClick',(e)=>{
        this.$emit('request',e)
      })
    }else{
      throw new Error("No visualization div inside VisGraph.")
    }
  }
  get network(){
    return networks.get(this.networkKey) as any
  }
  @Watch("visData")
  nodesChanged(newVal:VisGraphData & OpenedCommunitiesData, oldVal:VisGraphData & OpenedCommunitiesData){
    console.log("99999999")
    console.log(newVal.openedCommunities)
    if (newVal.openedCommunities) {
      let addedParent = newVal.openedCommunities.find((oc)=>{
        return !(oldVal.openedCommunities||[]).includes(oc)
      })
      if(!addedParent) return;
      const newNodes = newVal.nodes.filter(n=>n.parent == addedParent)
      const explodedVisNode = this.network?.body.nodes[addedParent]
      this.network?.body.data.nodes.remove([addedParent])
      this.network?.body.data.nodes.add(newNodes.map(n =>({
        ...n,
        x:explodedVisNode.x,
        y:explodedVisNode.y
      })))

      this.network?.body.data.edges.add(
        newVal.edges
        .filter(({from,to})=>{
          return newNodes.map(n=>n.id).includes(from) || newNodes.map(n=>n.id).includes(to)
        })
      )
      /*
      debugger;
      console.log("####NEW NODES####")
      console.log(newNodes)
      console.log("####EXPLODED NODE####")
      console.log(explodedNode)
      */
    }else{
      networks.get(this.networkKey)?.setData(Object.assign({},newVal))
    }
    
  }
  beforeDestroy(){
    networks.get(this.networkKey)?.destroy();
  }
}
</script>

<style>

</style>