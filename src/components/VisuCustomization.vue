<template>
  <div class="col">
    <q-form>
      <div class="q-gutter-md row">
        <q-select v-model="metric" :options="availableMetrics" label="Metric" class="col" hint="Metric representing size">
        </q-select>
        <q-select v-model="community" :options="availableCommunities" label="Community" class="col" hint="Top level community that will be represented">
        </q-select>
      </div>
      <div class="q-gutter-md row">
        <q-select v-model="scaling" :options="availableScalings" label="Scaling" class="col" hint="Scaling that will be applied to the metric">
        </q-select>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'
import { normalCasing } from "./Utils";
export interface Parameters{
  metric:string|null,
  community:number | { label: string; value: number; }|null,
  scaling:string|null
}
type OptionType = {
  label:string,
  value:string
}
@Component
export default class ClassComponent extends Vue {
  @Model('change', { type: Object }) readonly parameters!:Parameters;
  @Prop({ type: String, required: true }) readonly chosenType!: string;

  metric:OptionType|null=null;
  community:number | { label: string; value: number; }|null=null;
  scaling:string|null=null;

  mounted () {
    this.metric = this.valueToMetric(this.parameters.metric) ?? this.availableMetrics[0]
    this.community = this.parameters.community ?? this.availableCommunities[0]
    this.scaling = this.parameters.scaling ?? this.availableScalings[0]
  }

  get availableScalings ():Array<string> {
    return ['linear', 'log2', 'log10']
  }

  private valueToMetric (value:string|null):OptionType|null {
    if (value) {
      return this.availableMetrics.filter(o => o.value === value)[0]
    } else {
      return null
    }
  }

  get availableMetrics ():Array<OptionType> {
    return (this.$store.state.other.availableMetrics as string[]).map( v => ({
      label: normalCasing(v),
      value: v
    }));
  }

  @Watch('parameters')
  parametersChange (newVal:Parameters, oldVal:Parameters) {
    this.metric = this.valueToMetric(newVal.metric)
    this.community = newVal.community
    this.scaling = newVal.scaling
  }

  @Watch('metric')
  metricChange (newMetric:OptionType, oldMetric:OptionType) {
    this.parameters.metric = newMetric.value
    this.$emit('change', this.parameters)
  }

  @Watch('community')
  communityChange (newCommunity:number, oldCommunity:number) {
    this.parameters.community = newCommunity
    this.$emit('change', this.parameters)
  }

  @Watch('scaling')
  scalingChange (newVal:string, oldVal:string) {
    this.parameters.scaling = newVal
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