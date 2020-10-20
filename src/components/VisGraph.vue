<template>
  <div ref="visualization" class="fit"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Network, Options } from "vis-network";
import { VisData } from 'vis-network/declarations/network/gephiParser';
export type VisNode = { id:number, label:string };
export type VisEdge = { from:number, to:number, arrows?:string };
export type VisGraphData = { nodes:Array<VisNode>, edges:Array<VisEdge> }

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
  @Watch("visData")
  nodesChanged(newVal:VisData & OpenedCommunitiesData, oldVal:VisData & OpenedCommunitiesData){
    console.log("99999999")
    console.log(newVal.openedCommunities)
    if (newVal.openedCommunities) {
      let addedParent = newVal.openedCommunities.find((oc)=>{
        return !(oldVal.openedCommunities||[]).includes(oc)
      })
      const newNodes = newVal.nodes.filter(n=>n.parent == addedParent)
      const explodedVisNode = networks.get(this.networkKey)?.body.nodes[addedParent]
      networks.get(this.networkKey)?.body.data.nodes.remove([addedParent])
      networks.get(this.networkKey)?.body.data.nodes.add(newNodes.map(n =>({
        ...n,
        x:explodedVisNode.x,
        y:explodedVisNode.y
      })))
      
      const newNodeIds = 

      networks.get(this.networkKey)?.body.data.edges.add(
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