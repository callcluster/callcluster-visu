<template>
  <div class="row q-gutter-md">
    <div class="row items-center">
      <q-option-group
        v-model="chosen"
        :options="[
          { label: 'Treemap', value: 'treemap' },
          { label: 'Histogram', value: 'histogram' },
          { label: 'Hierarchical graph', value: 'hierarchical' },
          { label: 'Hierarchical colored graph', value: 'hierarchical-colored' },
          { label: 'Diff graph', value: 'diff' }
        ]"
        class="col"
      />
      
      <q-tab-panels v-model="chosen" animated class="col" style="height:25em">
        <q-tab-panel name="treemap">
          <q-card class="fit">
            <q-img src="graph.png" />
            <q-card-section>
              <div class="text-h6">Treemap</div>
              Reports some property representing size  as a treemap, on a single community.
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="histogram">
          <q-card class="fit">
            <q-img src="graph.png" />
            <q-card-section>
              <div class="text-h6">Histogram</div>
              Reports a property that represents size as a histogram.
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="hierarchical">
          <q-card class="fit">
            <q-img src="graph.png" />
            <q-card-section>
              <div class="text-h6">Hierarchical Graph</div>
              Allows the user to browse a community and the calls in it, and click on a node to view it's inner callgraph.
            </q-card-section>
          </q-card>
        </q-tab-panel>


        <q-tab-panel name="hierarchical-colored">
          <q-card class="fit">
            <q-img src="graph.png" />
            <q-card-section>
              <div class="text-h6">Colored Hierarchical Graph</div>
              A hierarchical graph that shows current what part of every "graphed" community corresponds to a different "colored" community.
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="diff">
          <q-card class="fit">
            <q-img src="graph.png" />
            <q-card-section>
              <div class="text-h6">Diff Graph</div>
              Exhibits the same graph side by side but with different colors, both communities chosen are "colorers".
            </q-card-section>
          </q-card>
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator'

@Component
export default class VisuTypeChooser extends Vue {
  @Model('change', {type:String}) chosen!:string;
  @Watch('chosen')
  panelChange(newVal:string,oldVal:string){
    this.$emit('change',newVal);
    console.log("it changes!!!!!")
  }
}
</script>

<style>

</style>