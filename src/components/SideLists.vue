<template>
  <div class="column fit">
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