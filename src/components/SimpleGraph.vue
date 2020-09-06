<template>
  <vis-graph :vis-data="graphData" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Community } from '../Types';
import VisGraph ,{ VisNode, VisEdge, VisGraphData} from "components/VisGraph.vue";
import { Edge } from 'vis-network';
@Component({
  components: { VisGraph }
})
export default class ClassComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly community!: Community | null;
  private getFunctions(community: Community | null):Array<number> {
    if(community==null){
      return [];
    }
    return [
      ... (community.functions || []), 
      ... (community.communities || []).flatMap(c=>this.getFunctions(c))
    ];
  }

  private getNodes(functions:Array<number>):Array<VisNode>{
    let funcs = this.$store?.state?.data?.functions;
    return functions.map((f)=>{ return {
      id:f,
      label:""
      //label:funcs[f].name,
    }});
  }
  isVisEdgeArray(o: any): o is Array<VisEdge> {
    return o instanceof Array && (
      o.length == 0 || 
      ("from" in o[0] && "to" in o[0])
    )
  }

  private getEdges(functions:Array<number>):Array<VisEdge>{
    let calls:any = this.$store?.state?.data?.calls;
    if(this.isVisEdgeArray(calls)){
      let filteredCalls = calls.filter(c => 
        "from" in c && functions.includes(c.from) &&
        "to" in c && functions.includes(c.to)
      )
      filteredCalls.forEach(e=>{
        e.arrows="to";
      });
      return filteredCalls;
    }else{
      return []
    }
  }

  get graphData():VisGraphData{
    const functions:Array<number> = this.getFunctions(this.community);
    return {
      nodes:this.getNodes(functions),
      edges:this.getEdges(functions)
    }
  }
}
</script>

<style>

</style>