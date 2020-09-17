<template>
  <div class="column fit relative-position">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey col-auto"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="communities" label="Communities" />
      <q-tab name="visualizations" label="Visualizations" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="communities" class="q-pa-xs">
        <q-scroll-area class="fit">
          <q-list separator>
            <q-item 
            clickable 
            v-ripple 
            v-for="c in communities" 
            @click="selectCommunity(c)"
            active-class="bg-primary text-grey-1"
            :active="selectedThing == c"
            >
              <q-item-section>
                <q-item-label>{{ c.name }}</q-item-label>
                <q-item-label caption>Mined community</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel name="visualizations" class="q-pa-xs">
        <q-scroll-area class="fit">
          <q-list separator>
            <q-item 
              clickable 
              v-ripple 
              v-for="v in visualizations" 
              @click="selectVisualization(v)"
              active-class="bg-primary text-grey-1"
              :active="selectedThing == v"
            >
              <q-item-section>
                <q-item-label>{{ v.name }}</q-item-label>
                <q-item-label caption>{{v.visualizationType}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
    <q-card class="absolute-bottom q-ma-md bg-secondary text-white">
      <q-toolbar>
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Add visualization</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-card-section>
        holis holis holis
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Todo, Meta } from './models'

@Component
export default class ClassComponent extends Vue {
  private tab:string = "communities";
  selectedThing=null;

  get visualizations () {
    let visuDict = this.$store.state.data.visualizations;
    return Object.entries(visuDict)
      .map(([i,v])=>Object.assign({},v,{id:i}))
  }
  selectVisualization(visualization:any){
    this.$emit('select-visualization',visualization)
    this.selectedThing=visualization;
  }
  selectCommunity(community:any){
    this.$emit('select-community',community)
    this.selectedThing=community;
  }

  get communities(){
    let commuDict = this.$store.state.data.communities;
    return Object.values(commuDict);
  }
  
}
</script>

<style>

</style>