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
    this.$el.addEventListener("dragstart", e => e.preventDefault())
    this.$el.addEventListener("dragover", e => e.preventDefault())
    this.$el.addEventListener('drop',(event) => {
      event.preventDefault()
      if((event as any)["dataTransfer"]["files"].length>=1){
        let file:File = ((event as any)["dataTransfer"]["files"][0] as File)
        console.log(file.path)
        this.$store.dispatch("data/setFilePath",file.path)
      }
      
    })
  }
}
</script>
