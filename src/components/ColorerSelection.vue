<template>
  <div class="col">
    <q-form>
      <div class="q-gutter-md row">
        <q-select v-model="leftColorer" :options="availableCommunities" label="Colored community for the graph" class="col" hint="Community that will determine the coloring of the graph" v-if="chosenType!=='diff'"/>
        <q-select v-model="leftColorer" :options="availableCommunities" label="Colored community for the graph on the left" class="col" hint="Community that will determine the coloring of the graph on the left" v-if="chosenType==='diff'"/>
        <q-select v-model="rightColorer" :options="availableCommunities" label="Colored community for the graph on the right" class="col" hint="Community that will determine the coloring for the graph on the right" v-if="chosenType==='diff'"/>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'
import { normalCasing } from "./Utils";
export interface Parameters{
  leftColorer:number | { label: string; value: number; }|null,
  rightColorer:number | { label: string; value: number; }|null,
}
type OptionType = {
  label:string,
  value:string
}
@Component
export default class ClassComponent extends Vue {
  @Model('change', { type: Object }) readonly parameters!:Parameters;
  @Prop({ type: String, required: true }) readonly chosenType!: string;

  leftColorer:number | { label: string; value: number; }|null = null
  rightColorer:number | { label: string; value: number; }|null = null

  mounted () {
    this.rightColorer = this.parameters.rightColorer
    this.leftColorer = this.parameters.leftColorer ?? this.availableCommunities[0]
  }
  get availableMetrics ():Array<OptionType> {
    return (this.$store.state.other.availableMetrics as string[]).map( v => ({
      label: normalCasing(v),
      value: v
    }));
  }

  @Watch('parameters')
  parametersChange (newVal:Parameters, oldVal:Parameters) {
    this.leftColorer = newVal.leftColorer
    this.rightColorer = newVal.rightColorer
  }

  @Watch('leftColorer')
  leftColorerChange (newCommunity:number, oldCommunity:number) {
    this.parameters.leftColorer = newCommunity
    this.$emit('change', this.parameters)
  }

  @Watch('rightColorer')
  rightColorerChange (newCommunity:number, oldCommunity:number) {
    this.parameters.rightColorer = newCommunity
    this.$emit('change', this.parameters)
  }

  get availableCommunities ():Array<{label:string,value:number}> {
    return Object.entries(this.$store.state.data.communities).map(([cid,community])=>({
      label:(community as {name:string}).name,
      value:parseInt(cid),
    }))
  }
}
</script>

<style>

</style>