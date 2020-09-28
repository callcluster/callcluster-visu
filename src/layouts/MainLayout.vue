<template>
  <q-layout view="hHh Lpr fFf" class="overflow-hidden">
    <details-popup/>
    <visualization-creation-dialog
      v-on:finish="finishCreation"
      ref="creation-dialog"
    />
    <visualization-deletion-dialog />

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
import VisualizationCreationDialog from 'components/VisualizationCreationDialog.vue'
import VisualizationView from 'components/VisualizationView.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Community } from '../Types'
import SideLists from 'components/SideLists.vue'
import DetailsPopup from 'components/DetailsPopup.vue'
import VisualizationDeletionDialog from 'components/VisualizationDeletionDialog.vue'
@Component({
  components: {
    EssentialLink,
    FileStructure,
    SimpleGraph,
    VisualizationCreationDialog,
    VisualizationView,
    SideLists,
    DetailsPopup,
    VisualizationDeletionDialog
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

  async selectVisualization (visualization:any) {
    await this.$store.dispatch('data/showVisualization', visualization)
  }

  editVisualization (id:string) {
    const dialog = this.$refs['creation-dialog'] as VisualizationCreationDialog
    const visu = {...this.$store.state.data.visualizations[id]}
    dialog.editVisualization(visu.name,visu.visualizationType,{ ...visu.parameters},id)
  }

  deleteVisualization (id:string) {
    this.$store.commit('other/setDeletableVisualization', id)
  }
}
</script>
