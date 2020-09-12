<template>
  <q-layout view="hHh Lpr fFf">
    <visualization-creation-dialog v-on:finish="finishCreation"/>
    <q-page-container>
      <q-splitter
        v-model="splitterModel"
        :limits="[0, 100]"
        class="fullscreen"
      >
        <template v-slot:before>
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
              <file-structure v-on:change="selectCommunity"/>
            </q-tab-panel>

            <q-tab-panel name="visualizations" class="q-pa-xs">
              <visualizations-list v-on:select="selectVisualization"/>
            </q-tab-panel>
          </q-tab-panels>
          
        </template>

        <template v-slot:after>
          <visualization-view />
          <!-- <router-view /> -->
          <!-- <simple-graph :community="community"/> -->
        </template>
      </q-splitter>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import FileStructure from 'components/FileStructure.vue'
import SimpleGraph from 'components/SimpleGraph.vue'
import VisualizationsList from "components/VisualizationsList.vue";
import VisualizationCreationDialog from "components/VisualizationCreationDialog.vue";
import VisualizationView from 'components/VisualizationView.vue'
import { Vue, Component, Model } from 'vue-property-decorator'
import { Community } from '../Types';

@Component({
  components: { 
    EssentialLink, 
    FileStructure, 
    SimpleGraph, 
    VisualizationsList,
    VisualizationCreationDialog,
    VisualizationView
  }
})
export default class MainLayout extends Vue {
  splitterModel = 20;
  community: Community|Object = {};
  tab="communities";
  selectCommunity(community:Community){
    this.community = community;
  }
  finishCreation(event:any){
    this.$store.commit('data/createVisualization', event)
  }
  selectVisualization(visualization:any){
    this.$store.dispatch('data/showVisualization',visualization)
  }
}
</script>
