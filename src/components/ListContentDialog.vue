<template>
  <div class="absolute-center q-pa-xl" v-if="opened">
    <q-card class="column" style="max-width:500px">
      <q-toolbar class="col-auto">
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Contents</q-toolbar-title>

        <q-btn flat round dense icon="close" v-on:click="opened = false"/>
      </q-toolbar>
      <div>
        <q-table
          style="max-height:400px;max-width:400px"
          virtual-scroll
          :data="information"
          :columns="columns"
          row-key="id"
          dense
          hide-bottom
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <img :src="props.row.image.unselected" width="20" height="20"/>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
  </div>
</template>
<script lang="ts">
interface Measurable{
  id:string
  name:string
}
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class ListContentDialog extends Vue {
  @Prop({ required: false}) information!:Measurable[]
  public opened=false
  @Watch("information")
  informationChanged(){
    this.opened=true
  }
  get columns(){
    return [
      {
        label:"Image",
        name:"image",
        sortable: false,
        headerStyle:"width:10%",
        style:"width:10%",
        field:"image"
      },
      {
        label:"Size",
        field:"value",
        style:"width:10%",
        headerStyle:"width:10%",
        sortable: true,
        name:"size"
      },
      {
        label:"Type",
        field: row=>(row.originalType || row.type),
        style:"width:20%",
        headerStyle:"width:20%",
        sortable: true,
        name:"type"
      },
      {
        label:"Name",
        field:"name",
        style:"width:40%;text-align:left",
        headerStyle:"width:40%;text-align:left",
        sortable: true,
        name:"name"
      }
    ]
  }

}
</script>

<style>

</style>