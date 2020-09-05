<template>
  <div ref="visualization" class="fit"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Network } from "vis-network";
type VisNode = { id:number, label:string };
type VisEdge = { from:number, to:number };
@Component
export default class VisGraph extends Vue {
  @Prop({ type: Array, required: true }) readonly nodes!: Array<VisNode>;
  @Prop({ type: Array, required: true }) readonly edges!: Array<VisEdge>;
  private network:Network | null = null;
  created(){
    this.network = null;
  }
  mounted(){
    let visuRef = this.$refs["visualization"];
    if(visuRef instanceof HTMLElement){
      this.network = new Network(visuRef,{ 
        nodes:this.nodes, 
        edges:this.edges 
      },{})
    }else{
      throw new Error("No visualization div inside VisGraph.")
    }
  }
  beforeDestroy(){
    this.network?.destroy();
  }
}
</script>

<style>

</style>