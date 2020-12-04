<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-card>
       <q-card-section>
        <div class="text-h6" v-if="editing">Extracting a new community</div>
        <div class="text-h6" v-if="!editing">Renaming a community</div>
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
        <q-btn flat label="Cancel" @click="cancel" />
        <q-btn flat label="OK" @click="ok"/>
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
    this.$store.commit('other/setExtractionDialogVisualization', community.communityId)
    this.name=community.name
    this.editing=true
    this.editedId=community.id
  }

  editing:boolean=false;
  editedId:number|null=null;
  
  name:string=""

  @Watch('defaultName')
  updateDefaultName(newVal:string){
    console.log(newVal)
    if(this.name===""){
      this.name=newVal
    }
  }

  cancel(){
    this.name=""
    this.showDialog = false
    this.editing = false
    this.editedId=null
  }

  ok(){
    if(this.editing){
      this.$store.dispatch("data/renameCommunity",{
        name: this.name,
        id: this.editedId ?? 0
      })
    } else {
      this.$store.dispatch("data/extractCommunity",{
        name: this.name,
        communityId: this.communityId
      })
    }
    this.name=""
    this.showDialog = false
    this.editedId=null
    this.editing = false
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