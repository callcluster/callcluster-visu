<template>
  <transition
    appear
    enter-active-class="animated bounceIn"
    leave-active-class="animated fadeOut"
    class="overflow-hidden"
  >
   <q-card
   class="q-ma-md bg-secondary text-white z-top small-card absolute"
   draggable="true"
   @mousedown="mousedown"
   @mouseup="mouseup"
   @mousemove="mousemove"
   v-if="opened"
   :style="style"
   transition="jump-up"
   :key="JSON.stringify(details)"
   >
      <q-toolbar>
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Inspection</q-toolbar-title>

        <q-btn flat round dense icon="close" @click="close" />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6 break-word">
          {{name}}
          <q-btn flat round color="white" icon="content_copy" @click="copyName" />
        </div>
        <div class="text-subtitle2 break-word">{{objectType}}</div>
      </q-card-section>
      <q-separator v-if="location" dark/>
      <q-card-section v-if="location" class="break-word">
        {{location}}
        <q-btn flat round color="white" icon="content_copy" @click="copyLocation" size="8pt" />
      </q-card-section>
      <q-separator dark/>
      <q-table
        :data="tableData"
        :columns="tableColumns"
        row-key="name"
        hide-bottom
        hide-header
        class="bg-secondary"
        dark
        dense
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            {{props.value}}
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
              {{props.value}}
            </q-tooltip>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </transition>
</template>

<script lang="ts">
/// <reference lib="dom" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import { copyToClipboard } from 'quasar'
import { normalCasing } from './Utils'
declare var document: Document
@Component
export default class DetailsPopup extends Vue {
  private dragging=false
  private relativeMouseX=0
  private relativeMouseY=0
  private top=0
  private left=0
  private opened = false

  private tableColumns =[
    { name: 'name', field: 'name', style: 'width:65%;' },
    { name: 'value', field: 'value', style: 'width:35%;' }
  ]

  get tableData () {
    const bannedKeys = ['name', 'type', 'displayName', 'location']
    const extra = (this.objectType === "function") ? "" : " (sum)"
    return Object.entries(this.details || {}).filter(([k]) => {
      return k[0] !== '_' && !bannedKeys.includes(k)
    }).map(([k, v]) => ({
      name: normalCasing(k) + extra,
      value: v
    }))
  }

  get style ():string {
    return `top:${this.top}px;left:${this.left}px`
  }

  get details ():Record<string, string> | null{
    return this.$store.state.other.shownDetails
  }

  @Watch('details')
  watchDetails (newVal:Record<string,string>|null, oldVal:Record<string,string>|null) {
    this.opened = true
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
  }

  mouseup (e:MouseEvent) {
    this.dragging = false
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

  get name () {
    return this.details?.['name'] || this.details?.['displayName'] || 'no name'
  }

  get objectType () {
    return this.details?.['type'] || 'unknown type'
  }

  get location () {
    return this.details?.['location'] || ''
  }

  async copyName () {
    await copyToClipboard(this.name)
  }

  async copyLocation () {
    await copyToClipboard(this.location)
  }
}
</script>

<style scoped>
.small-card {
  width: 300px;
  cursor: move;
}
.break-word {
  overflow-wrap: break-word;
}
</style>
