<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" text-color="negative"/>
          <span class="q-ml-sm">Are you sure you wish to delete visualization {{name}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteCommunity"  />
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
})
export default class CommunityDeletionDialog extends Vue {
  get showDialog ():boolean {
    return this.$store.state.other.deletableCommunity !== null
  }

  set showDialog (v:boolean) {
    if(!v){
      this.$store.commit('other/setDeletableCommunity', null)
    }
  }

  get name():string {
    let id = this.$store.state.other.deletableCommunity
    return this.$store.state.data.communities[id]?.name
  }

  async deleteCommunity () {
    const deletedId=this.$store.state.other.deletableCommunity
    await this.$store.commit('data/deleteCommunityFromVisualizer', deletedId)
    await this.$store.dispatch('data/deleteCommunityFromBackend', deletedId)
    await this.$store.commit('other/setDeletableCommunity', null)
  }

}
</script>

<style>

</style>