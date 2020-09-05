<template>
  <vis-graph 
  :nodes="graphData.nodes"
  :edges="graphData.edges"
  />
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Community } from '../Types';
import VisGraph from "components/VisGraph.vue";
@Component({
  components: { VisGraph }
})
export default class ClassComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly community!: Community;

  get graphData(){
    return {
      nodes:[
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
      ],
      edges:[
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5},
        {from: 3, to: 3}
      ]
    }
  }
}
</script>

<style>

</style>