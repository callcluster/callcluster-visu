<template>
  <q-layout view="hHh Lpr fFf" class="overflow-hidden">
    <details-popup/>
    <visualization-creation-dialog
      v-on:finish="finishCreation"
      ref="creation-dialog"
    />
    <visualization-deletion-dialog />
    <community-deletion-dialog/>
    <cluster-creation-dialog v-on:create="finishClusteringCreation"/>
    <extraction-dialog ref="extraction-dialog"/>

    <q-page-container>
      <q-splitter
        v-model="splitterModel"
        :limits="[30, 100]"
        class="fullscreen"
      >
        <template v-slot:before>
          <side-lists
            @select-commmunity="selectCommunity"
            @select-visualization="selectVisualization"
            @edit-visualization="editVisualization"
            @delete-visualization="deleteVisualization"
            @rename-community="renameCommunity"
            @delete-community="deleteCommunity"
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
import VisualizationCreationDialog from 'components/VisualizationCreationDialog.vue'
import VisualizationView from 'components/VisualizationView.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Community } from '../Types'
import SideLists from 'components/SideLists.vue'
import DetailsPopup from 'components/DetailsPopup.vue'
import VisualizationDeletionDialog from 'components/VisualizationDeletionDialog.vue'
import ExtractionDialog from 'components/ExtractionDialog.vue'
import CommunityDeletionDialog from "components/CommunityDeletionDialog.vue";
import ClusterCreationDialog from "components/ClusterCreationDialog.vue";
@Component({
  components: {
    EssentialLink,
    FileStructure,
    VisualizationCreationDialog,
    VisualizationView,
    SideLists,
    DetailsPopup,
    VisualizationDeletionDialog,
    ExtractionDialog,
    CommunityDeletionDialog,
    ClusterCreationDialog
  }
})
export default class MainLayout extends Vue {
  splitterModel = 20;

  selectCommunity (community:Community) {
    console.log(community)
  }

  finishCreation (event:any) {
    this.$store.commit('data/createOrEditVisualization', event)
  }

  finishClusteringCreation(event:any){
    this.$store.dispatch('data/createOrEditClustering', event)
  }

  async selectVisualization (visualization:any) {
    await this.$store.dispatch('data/showVisualization', visualization)
  }

  editVisualization (id:number) {
    const dialog = this.$refs['creation-dialog'] as VisualizationCreationDialog
    const visu = {...this.$store.state.data.visualizations[id]}
    dialog.editVisualization(visu.name,visu.visualizationType,{ ...visu.parameters},id)
  }

  deleteVisualization (id:string) {
    this.$store.commit('other/setDeletableVisualization', id)
  }

  renameCommunity(community:{id:number,name:string,description:string,communityId:number}){
    const dialog = this.$refs['extraction-dialog'] as ExtractionDialog
    dialog.rename(community)
  }

  deleteCommunity(community:{id:number,name:string,description:string,communityId:number}){
    this.$store.commit('other/setDeletableCommunity', community.id)
  }
}
</script>
