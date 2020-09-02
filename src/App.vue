<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {registerProxy} from "./store"
@Component
export default class App extends Vue {
  mounted(){
    registerProxy(this.$store)
  }
}
</script>
