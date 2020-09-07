<template>
  <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Todo, Meta } from './models'
import { ipcRenderer } from "electron";
@Component
export default class VisualizationsList extends Vue {
  get showDialog(){
    console.log("%%%%%%%%-------",this.$store.state.other.viewCreateVisualization)
    return this.$store.state.other.viewCreateVisualization;
  }
  set showDialog(v){
    this.$store.commit('other/setCreateVisualization', v)
  }
}

</script>

<style>

</style>