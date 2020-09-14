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
          <side-lists 
            @select-commmunity="selectCommunity"
            @select-visualization="selectVisualization"
          />
        </template>

        <template v-slot:after>
          <visualization-view />
        </template>
      </q-splitter>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import FileStructure from 'components/FileStructure.vue'
import SimpleGraph from 'components/SimpleGraph.vue'
import VisualizationCreationDialog from "components/VisualizationCreationDialog.vue";
import VisualizationView from 'components/VisualizationView.vue'
import { Vue, Component, Model } from 'vue-property-decorator'
import { Community } from '../Types'
import SideLists from 'components/SideLists.vue'
@Component({
  components: { 
    EssentialLink, 
    FileStructure, 
    SimpleGraph, 
    VisualizationCreationDialog,
    VisualizationView,
    SideLists
  }
})
export default class MainLayout extends Vue {
  splitterModel = 20;
  
  selectCommunity(community:Community){
    console.log(community);
  }
  finishCreation(event:any){
    this.$store.commit('data/createVisualization', event)
  }
  selectVisualization(visualization:any){
    this.$store.dispatch('data/showVisualization',visualization)
  }
}
</script>