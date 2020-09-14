<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="communities" label="Communities" />
      <q-tab name="visualizations" label="Visualizations" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="communities" class="q-pa-xs">
        <q-list separator>
          <q-item clickable v-ripple v-for="c in communities" @click="selectCommunity(c)">
            <q-item-section>
              <q-item-label>{{ c.name }}</q-item-label>
              <q-item-label caption>Mined community</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="visualizations" class="q-pa-xs">
        <q-list separator>
          <q-item clickable v-ripple v-for="v in visualizations" @click="selectVisualization(v)">
            <q-item-section>
              <q-item-label>{{ v.name }}</q-item-label>
              <q-item-label caption>{{v.visualizationType}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Todo, Meta } from './models'

@Component
export default class ClassComponent extends Vue {
  private tab:string = "communities";

  get visualizations () {
    let visuDict = this.$store.state.data.visualizations;
    return Object.entries(visuDict)
      .map(([i,v])=>Object.assign({},v,{id:i}))
  }
  selectVisualization(visualization:any){
    this.$emit('select-visualization',visualization)
  }
  selectCommunity(community:any){
    this.$emit('select-community',community)
  }

  get communities(){
    let commuDict = this.$store.state.data.communities;
    return Object.values(commuDict);
  }
  
}
</script>

<style>

</style>