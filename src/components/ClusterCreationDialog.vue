<template>
  <q-dialog v-model="showDialog" ref="dialog">
    <q-card style="width:500px;">
      <q-card-section>
        <div class="text-h6">Create a new cluster</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form>
          <div class="q-gutter-md row full-width">
            <q-input 
              v-model="name"
              label="Created community name" 
              :rules="[val => !!val || 'Required']"
              ref="nameInput"
              class="full-width"
            />
          </div>
          <div class="q-gutter-md row">
            <q-select 
              v-model="community" 
              :options="availableCommunities" 
              label="Clustered Community" 
              class="col" 
              hint="Top level community that will be clustered"
              :rules="[val => !!val || 'Required']"
              ref="communitySelector"
            >
            </q-select>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="createClustering" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator'
import { normalCasing } from "./Utils";
import { QInput, QDialog } from 'quasar'

@Component
export default class ClassComponent extends Vue {
  name:string=""
  community:number | { label: string; value: number; }|null=null;

  get nameInput(){
    return this.$refs['nameInput'] as QInput
  }

  get communitySelector(){
    return this.$refs['communitySelector'] as QInput
  }

  get dialog(){
    return this.$refs['dialog'] as QDialog
  }

  get showDialog ():boolean {
    return this.$store.state.other.viewCreateClustering;
  }

  set showDialog (open:boolean){
    this.$store.commit('other/setCreateClustering',open)
  }

  get availableCommunities ():Array<{label:string,value:number}> {
    return Object.entries(this.$store.state.data.communities).map(([cid,community])=>({
      label:(community as {name:string}).name,
      value:parseInt(cid),
    }))
  }

  createClustering(){
    this.nameInput.validate()
    this.communitySelector.validate()
    console.log(this.name)
    console.log(this.community)

    if(this.name && this.community){
      this.$emit("create",{
        name:this.name,
        community:this.community,
      })
      this.name=""
      this.community=null
      this.showDialog=false
    }else{
      this.dialog.shake()
    }
  }

}
</script>