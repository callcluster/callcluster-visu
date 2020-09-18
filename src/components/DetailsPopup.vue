<template>
   <q-card 
   :class="'q-ma-md bg-secondary text-white z-top small-card '+extraClass" 
   draggable="true"
   @mousedown="mousedown"
   @mouseup="mouseup"
   @mousemove="mousemove"
   :style="style"
   >
      <q-toolbar>
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Add visualization</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-card-section>
        holis holis holis
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn>
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
declare var document: Document;
@Component
export default class DetailsPopup extends Vue {
  extraClass='absolute-bottom'
  private dragging=false
  private top=0
  private left=0
  get style():string{
    return `top:${this.top}px;left:${this.left}px`
  }
  mounted(){
    document.addEventListener("mouseup",this.mouseup)
    document.addEventListener("mousemove",this.mousemove)
  }
  destroyed(){
    document.removeEventListener("mouseup",this.mouseup)
    document.removeEventListener("mousemove",this.mousemove)
  }
  mousedown(e:any){
    this.dragging=true;
    console.log(e)
  }
  mouseup(e:any){
    this.dragging=false;
    console.log(e)
  }
  mousemove(e:any){
    if(this.dragging){
      this.top=e.clientY
      this.left=e.clientX
    }
  }
}
</script>

<style scoped>
.small-card {
  width: 300px;
}
</style>