<template>
  <q-dialog v-model="showDialog" >
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
        caption="not necessary for this graph"
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
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    </q-dialog>
</template>

<script>
import SelectableImageComponent from "components/SelectableImageComponent.vue"
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Todo, Meta } from './models'
import { ipcRenderer } from "electron";
import VisuTypeChooser from "./VisuTypeChooser.vue";
import VisuCustomization from "./VisuCustomization.vue"

@Component({
  components:{ VisuTypeChooser, VisuCustomization }
})
export default class VisualizationCreationDialog extends Vue {
  step=1;
  chosen="treemap";
  parameters={metric:null,community:null};
  get showDialog(){
    console.log("%%%%%%%%-------",this.$store.state.other.viewCreateVisualization)
    return this.$store.state.other.viewCreateVisualization;
  }
  set showDialog(v){
    this.$store.commit('other/setCreateVisualization', v)
  }
  get customizationDescription(){
    let params = this.parameters;
    return Object.keys(params).filter(k => params[k]!=null).map((k)=>k+": "+params[k]).join(", ")
  }
}

</script>

<style>

</style>