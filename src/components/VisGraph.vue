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
      nw.on('selectNode',(e)=>{
        if (e.event.srcEvent.ctrlKey) {
          this.$emit('explode',e)
        } else {
          this.$emit('select',e)
        }
      })
      nw.on('doubleClick',(e)=>{
        if (e.event.srcEvent.ctrlKey) {
          this.$emit('explode',e)
        } else {
          this.$emit('request',e)
        }
      })
    }else{
      throw new Error("No visualization div inside VisGraph.")
    }
  }
  @Watch("visData")
  nodesChanged(d:VisData){
    console.log("Data changed!")
    console.log(d)
    console.log(networks.get(this.networkKey))
    networks.get(this.networkKey)?.setData(Object.assign({},d))
  }
  beforeDestroy(){
    networks.get(this.networkKey)?.destroy();
  }
}
</script>

<style>

</style>