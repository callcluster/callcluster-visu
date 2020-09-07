<template>
  <div>
    <q-list separator>
      <q-item clickable v-ripple v-for="v in visualizations">
        <q-item-section>
          <q-item-label>{{ v }}</q-item-label>
          <q-item-label caption>Visualization type</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { Vue, Component} from 'vue-property-decorator'
@Component
export default class VisualizationsList extends Vue {
  get visualizations () {
    return this.$store.state.data.visualizations;
  }
}

</script>

<style>

</style>