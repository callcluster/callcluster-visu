<template>
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
      :key="JSON.stringify(part)"
    >
      <a
        style="max-width:120px; direction:rtl; cursor:pointer"
        class="ellipsis"
        @click="clickShown(part.path)"
      ><q-icon :name="part.icon" /> {{part.name}}</a>
      <q-tooltip>
        {{part.name}}
      </q-tooltip>
    </q-breadcrumbs-el>
  </q-breadcrumbs>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'

type PathItem = {
  name?:string,
  icon?:string,
  path:Array<string>
}

@Component
export default class PathNavigator extends Vue {
  @Model('change', { type: Array }) readonly path!: Array<string>;
  get shownPaths ():Array<PathItem> {
    let arr:Array<PathItem> = (this.path || []).map((v, i, a) => ({
      name: v,
      path: a.slice(0, i + 1)
    }))
    arr = [{
      icon: 'home',
      path: []
    }, ...arr]
    return arr.slice(Math.max(0, arr.length - 5))
  }

  clickShown (path:Array<string>) {
    this.$emit('change', path)
  }
}

</script>

<style>

</style>