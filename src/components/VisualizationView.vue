<template>
    <div v-if="visualization.id" class="full-height">
        <treemap-view 
        v-if="visualization.visualizationType=='treemap'"
        class="full-height"
        :visualization="visualization"
        v-on:request="request"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Watch } from 'vue-property-decorator'
import TreemapView from "components/TreemapView.vue";
@Component({
    components:{
        TreemapView
    }
})
export default class VisualizationView extends Vue {
    get visualization(){
        return this.$store.state.other.visualization;
    }
    request(visualization:any){
        this.$store.dispatch('data/showVisualization',visualization)
    }
}
</script>

<style>

</style>