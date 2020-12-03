<template>
<div :key="JSON.stringify(path)">
  <q-breadcrumbs active-color="primary">
    <template v-slot:separator>
      <q-icon
      size="1.5em"
      name="chevron_right"
      color="primary"
      />
    </template>
    <q-breadcrumbs-el
      v-for="part in shownPaths"
      :key="part.id"
    >
      <a
        style="max-width:120px; direction:rtl; cursor:pointer"
        class="ellipsis"
        @click="clickShown(part)"
      ><q-icon :name="part.icon" /> {{part.name}}</a>
      <q-tooltip>
        {{part.name}}
      </q-tooltip>
    </q-breadcrumbs-el>
  </q-breadcrumbs>
</div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

type PathItem = {
  name:string,
  icon?:string,
  id:string
}

const PathNavigatorProps = Vue.extend({
  props: {
    path: {
      type:Array,
      default:[]
    }
  }
})

@Component
export default class PathNavigator extends PathNavigatorProps {

  path!:Array<{name:string,id:string}>

  get shownPaths ():Array<PathItem> {
    const path=this.path
    const arr:PathItem[] = [...path]
    if(arr.length>0){
      arr[0].icon="home"
    }
    return arr.slice(Math.max(0, arr.length - 5))
  }

  clickShown (clicked:{name:string,id:string}) {
    this.$emit('change', clicked.id)
  }
}

</script>

<style>

</style>