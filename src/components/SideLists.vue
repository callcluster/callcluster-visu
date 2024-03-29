<template>
  <div class="column fit">
    <q-toolbar>
      <q-tabs
        v-model="tab"
        class="text-grey col"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="communities" label="Communities" />
        <q-tab name="visualizations" label="Visualizations" />
      </q-tabs>
    </q-toolbar>
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
            >
              <q-item-section>
                <q-item-label>{{ c.name }}</q-item-label>
                <q-item-label caption>{{ c.description }}</q-item-label>
              </q-item-section>
              <q-item-section avatar v-if="c.name!='Mined community'">
                <q-btn flat round icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="renameCommunity(c)"
                      >
                        <q-item-section>Rename</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="deleteCommunity(c)"
                      >
                        <q-item-section class="text-negative">Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>

                </q-btn>
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
            >
              <q-item-section>
                <q-item-label>{{ v.name }}</q-item-label>
                <q-item-label caption v-html="description(v)"></q-item-label>
              </q-item-section>
              <q-item-section avatar>
                 <q-btn flat round icon="more_vert">
                   <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="editVisu(v.id)"
                      >
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="deleteVisu(v.id)"
                      >
                        <q-item-section class="text-negative">Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>

                 </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { descriptionOfVisualization } from './Utils'

@Component
export default class ClassComponent extends Vue {
  private tab:string = "communities";
  selectedThing=null;

  get visualizations () {
    let visuDict:Record<number,{
      name:string
    }> = this.$store.state.data.visualizations;
    return Object.entries(visuDict)
      .map(([i,v]) => ({...v, id:i}))
  }

  selectVisualization (visualization:any) {
    this.$emit('select-visualization', visualization)
    this.selectedThing = visualization
  }

  selectCommunity (community:any) {
    this.$emit('select-community', community)
    this.selectedThing=community
  }

  get communities ():{name:string,description:string,id:number}[] {
    let commuDict = this.$store.state.data.communities;
    return Object.values(commuDict);
  }

  editVisu (id:number) {
    this.$emit('edit-visualization', id)
  }

  deleteVisu (id:string) {
    this.$emit('delete-visualization', id)
  }

  description (visualization:Record<string, any>) {
    return descriptionOfVisualization(visualization)
  }

  renameCommunity(community:{id:number,name:string,description:string,communityId:number}){
    this.$emit('rename-community', community)
  }

  deleteCommunity(community:{id:number,name:string,description:string,communityId:number}){
    this.$emit('delete-community', community)
  }
}
</script>

<style>

</style>