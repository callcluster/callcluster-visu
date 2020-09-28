<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" text-color="negative"/>
          <span class="q-ml-sm">Are you sure you wish to delete visualization {{name}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteVisualization"  />
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
})
export default class VisualizationDeletionDialog extends Vue {
  get showDialog ():boolean {
    return this.$store.state.other.deletableVisualization !== null
  }

  set showDialog (v:boolean) {
    if(!v){
      this.$store.commit('other/setDeletableVisualization', null)
    }
  }

  get name():string {
    let id = this.$store.state.other.deletableVisualization
    return this.$store.state.data.visualizations[id]?.name
  }

  async deleteVisualization () {
    await this.$store.commit('data/deleteVisualization', this.$store.state.other.deletableVisualization)
    await this.$store.commit('other/setDeletableVisualization', null)
  }

}
</script>

<style>

</style>