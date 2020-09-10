<template>
  <div class="col">
    <q-form
      class="q-gutter-md row"
    >
      <q-select v-model="metric" :options="availableMetrics" label="Metric" class="col" hint="Metric representing size">
      </q-select>

      <q-select v-model="community" :options="availableCommunities" label="Community" class="col" hint="Top level community that will be represented">
      </q-select>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ClassComponent extends Vue {
  @Model('change', {type:Object}) readonly parameters!: any;
  @Prop({ type: String, required: true }) readonly chosenType!: string;

  metric:string|null=null;
  community:string|null=null;

  mounted(){
    this.metric = this.parameters.metric || this.availableMetrics[0];
    this.community = this.parameters.community || this.availableCommunities[0];
  }

  get availableMetrics():Array<string>{
    return [
      'Google', 
      'Facebook', 
      'Twitter', 
      'Apple', 
      'Oracle',
      'holis'
    ];
  }
  @Watch('metric')
  metricChange(newMetric:string,oldMetric:string){
    this.parameters.metric = newMetric;
    this.$emit('change',this.parameters)
  }

  @Watch('community')
  communityChange(newCommunity:string,oldCommunity:string){
    this.parameters.community = newCommunity;
    this.$emit('change',this.parameters)
  }

  get availableCommunities():Array<string>{
    return [
      'Google', 
      'Facebook', 
      'Twitter', 
      'Apple', 
      'Oracle',
      'holis'
    ];
  }
}
</script>

<style>

</style>