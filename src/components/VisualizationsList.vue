<template>
  <div>
    <q-list separator>
      <q-item clickable v-ripple v-for="v in visualizations" @click="show(v)">
        <q-item-section>
          <q-item-label>{{ v.name }}</q-item-label>
          <q-item-label caption>{{v.visualizationType}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
@Component
export default class VisualizationsList extends Vue {
  get visualizations () {
    let visuDict = this.$store.state.data.visualizations;
    return Object.entries(visuDict)
      .map(([i,v])=>Object.assign({},v,{id:i}))
  }
  show(visualization:any){
    this.$emit('select',visualization)
  }
}
</script>

<style>

</style>