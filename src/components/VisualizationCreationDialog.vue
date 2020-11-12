<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-stepper
      v-model="step"
      vertical
      animated
      style="width:560px"
    >
      <q-toolbar>
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Add visualization</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-step
        :name="1"
        title="Select visualization type"
        icon="insert_chart_outlined"
        :caption="chosen"
        :done="step > 1"
      >
        <visu-type-chooser v-model="chosen"/>

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Customize"
        icon="assignment"
        :caption="customizationDescription"
        :done="step > 2"
      >
        <visu-customization :chosen-type="chosen" v-model="parameters" />

        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Continue" />
          <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Set colored community"
        caption="Not necessary for this graph"
        icon="format_list_bulleted"
        disable
      >
        This step won't show up because it is disabled.
      </q-step>

      <q-step
        :name="4"
        title="Name the new visualization"
        icon="add_comment"
      >
        <q-input 
          v-model="name" 
          label="Visualization name" 
          :rules="[val => !!val || 'Name is required']"
          ref="nameInput"
        />

        <q-stepper-navigation>
          <q-btn @click="createVisualization" color="primary" label="Finish" />
          <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-dialog>
</template>

<script lang="ts">
import SelectableImageComponent from "components/SelectableImageComponent.vue"
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Todo, Meta } from './models'
import { ipcRenderer } from "electron";
import { QInput, QDialog } from 'quasar'
import VisuTypeChooser from "./VisuTypeChooser.vue";
import VisuCustomization from "./VisuCustomization.vue"

@Component({
  components:{ VisuTypeChooser, VisuCustomization }
})
export default class VisualizationCreationDialog extends Vue {
  editVisualization (name:string, visualizationType:string, parameters:Record<string, string|null>, edited:number) {
    this.showDialog = true
    this.$nextTick(() => {
      this.name = name
      this.chosen = visualizationType
      this.parameters = { ...parameters }
      this.edited = edited
    })
  }

  name: string | null = null;
  step=1;
  chosen='treemap'
  edited:number|null = null

  parameters:Record<string, string|null> = { metric: null, community: null, scaling: null }

  get showDialog () {
    return this.$store.state.other.viewCreateVisualization;
  }

  set showDialog (v) {
    this.$store.commit('other/setCreateVisualization', v)
  }

  @Watch('showDialog')
  changeShowDialog () {
    this.resetContent()
  }

  get customizationDescription(){
    let params = this.parameters;
    return Object.keys(params).filter(k => params[k]!=null).map((k)=>k+": "+params[k]).join(", ")
  }

  get nameInput(){
    return this.$refs['nameInput'] as QInput
  }

  get dialog(){
    return this.$refs["dialog"] as QDialog
  }

  createVisualization () {
    this.nameInput.validate()
    if(this.name){
      this.showDialog = false;
      this.$emit("finish",{
        id:this.edited,
        name:this.name,
        visualizationType:this.chosen,
        parameters:this.parameters,
      })
      this.resetContent()
    }else{
      this.dialog.shake()
    }
  }

  private resetContent () {
    this.name = null
    this.chosen = 'treemap'
    this.parameters = { metric: null, community: null }
    this.step = 1
    this.edited = null
  }
}

</script>

<style scoped>
</style>