<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-card>
       <q-card-section>
        <div class="text-h6">Extracting a new community</div>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-input 
          v-model="name" 
          label="Extracted community name" 
          class="full-width"
          :rules="[val => !!val || 'Name is required']"
          ref="nameInput"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup @click="clearName" />
        <q-btn flat label="OK" @click="extractCommunity"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component({
})
export default class ExtractionDialog extends Vue {
  rename(community: {id:number,name:string,description:string,communityId:number}) {
    console.log(community)
    throw new Error('Method not implemented.')
  }
  
  name:string=""

  @Watch('defaultName')
  updateDefaultName(newVal:string){
    console.log(newVal)
    if(this.name===""){
      this.name=newVal
    }
  }

  clearName(){
    this.name=""
  }

  extractCommunity(){
    this.$store.dispatch("data/extractCommunity",{
      name:this.name,
      communityId:this.communityId
    })
    this.clearName()
    this.showDialog = false;
  }


  get defaultName():string{
    if( this.$store.state.other.extractionDetails == null ){
      return ""
    }else{
      return this.$store.state.other.extractionDetails.type 
      + " "
      + this.$store.state.other.extractionDetails.name
    }
  }

  get communityId():number{
    return this.$store.state.other.extractionDetails._treemap_id
  }

  get showDialog ():boolean {
    return this.$store.state.other.extractionDialogVisualization !== null
  }

  set showDialog (v:boolean) {
    if(!v){
      this.$store.commit('other/setExtractionDialogVisualization', null)
      this.name=""
    }
  }
  /*
  get name():string {
    let id = this.$store.state.other.extractionDialogVisualization
    return this.$store.state.data.visualizations[id]?.name
  }
  */
}
</script>

<style>

</style>