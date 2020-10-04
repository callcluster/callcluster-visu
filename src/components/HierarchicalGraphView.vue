<template>
  <vis-graph :visData="visData"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisGraph from 'components/VisGraph.vue'
@Component({
  components:{
    VisGraph
  }
})
export default class HierarchicalGraphView extends Vue {
  @Prop() visualization!:Record<string,object>
  get visData () {
    return {
      nodes: this.visualization.nodes,
      edges: this.visualization.edges
    }
  }
}
</script>

<style>

</style>
