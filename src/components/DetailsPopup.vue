<template>
  <transition
    appear
    enter-active-class="animated bounceIn"
    leave-active-class="animated fadeOut"
  >
   <q-card
   class="q-ma-md bg-secondary text-white z-top small-card"
   draggable="true"
   @mousedown="mousedown"
   @mouseup="mouseup"
   @mousemove="mousemove"
   v-if="opened"
   :style="style"
   transition="jump-up"
   >
      <q-toolbar>
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Add visualization</q-toolbar-title>

        <q-btn flat round dense icon="close" @click="close" />
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
  </transition>
</template>

<script lang="ts">
/// <reference lib="dom" />
import { Vue, Component } from 'vue-property-decorator'
declare var document: Document;
@Component
export default class DetailsPopup extends Vue {
  private dragging=false
  private relativeMouseX=0
  private relativeMouseY=0
  private top=0
  private left=0
  private opened = true

  get style ():string {
    return `top:${this.top}px;left:${this.left}px`
  }

  boundMouseup = this.mouseup.bind(this)
  boundMouseMove=this.mousemove.bind(this)

  mounted () {
    document.addEventListener('mouseup', this.boundMouseup)
    document.addEventListener('mousemove', this.boundMouseMove)
  }

  destroyed () {
    document.removeEventListener('mouseup', this.boundMouseup)
    document.removeEventListener('mousemove', this.boundMouseMove)
  }

  mousedown (e:MouseEvent) {
    this.dragging = true
    this.relativeMouseX = e.clientX - this.left
    this.relativeMouseY = e.clientY - this.top
    console.log(e)
  }

  mouseup (e:MouseEvent) {
    this.dragging = false
    console.log(e)
  }

  mousemove (e:MouseEvent) {
    if (this.dragging) {
      this.top = e.clientY - this.relativeMouseY
      this.left = e.clientX - this.relativeMouseX
    }
  }

  close () {
    this.opened = false
  }
}
</script>

<style scoped>
.small-card {
  width: 300px;
  cursor: move;
}
</style>
