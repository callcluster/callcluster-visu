<template>
  <div class="absolute-center q-pa-xl" v-if="opened">
    <q-card class="column" style="max-width:500px">
      <q-toolbar class="col-auto">
        <q-icon name="insert_chart_outlined" size="md"/>

        <q-toolbar-title>Contents</q-toolbar-title>

        <q-btn flat round dense icon="close" v-on:click="opened = false"/>
      </q-toolbar>
      <q-card-section class="col-auto" v-if="colorInsideResume.length>0">
        <div>
          <span class="text-h6">{{colorInsideResume.length}}</span>
          <span class="text-body-1"> clusters contained</span>
        </div>
        <div>        
          <span class="text-body-1" v-if="colorInsideResume.length>8">Top 8 clusters:</span>
          <div class="row">
            <div 
              v-for="colorInside, index in colorInsideResume.slice(0,8)" 
              :key="colorInside.id"
              :style="`
                width:30px;
                height:30px;
                border-radius:50% 50%;
                background-color:${colorsInsideDict[colorInside.id].colorCode};
              `"
              class="text-center q-pa-xs q-ma-xs"
            >
              {{index+1}}
            </div>
          </div>
        </div>
      </q-card-section>
      <div class="col">
        <q-table
          style="max-height:400px;max-width:400px"
          virtual-scroll
          :data="informationWithOwnership"
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
          <template v-slot:body-cell-ownership="props">
            <q-td :props="props">
              <span 
                v-for="ownership in props.row.ownership"
                :key="JSON.stringify(ownership)"
                :style="`color:${ownership.color};`"
              >
                {{ownership.text}}
              </span>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
  </div>
</template>
<script lang="ts">
interface ColorInside{
  id:string
  value:number
}
interface Measurable{
  id:string
  name:string
  color:string
  colorsInside:ColorInside[]
}
interface Ownership{
  color:string
  text:string
  cluster:number
}
interface MeasurableWithOwnership extends Measurable{
  ownership?:Ownership[]
}
interface ColorInsideFullDescription{
  colorId:string
  colorCode:string
  position:number
  value:number
}
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Color from 'color'

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
        field: (row:any)=>(row.originalType || row.type),
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
      },
      ...this.ownershipColumn
    ]
  }

  get ownershipColumn():object[]{
    if(this.colorInsideResume.length>0){
      return [{
        label:"Ownership",
        name:"ownership",
        sortable:true,
        sort: (a:any, b:any, rowA:any, rowB:any) => (rowB.ownership[0].cluster-rowA.ownership[0].cluster),
        field: "colorsInside",
        style:"text-align:left",
        headerStyle:"text-align:left",
      }]
    }else{
      return []
    }
  }

  get informationWithOwnership():MeasurableWithOwnership[]{
    if(this.colorInsideResume.length==0){
      return this.information
    }else{
      return this.information.map(measurable=>{
        const sortedColors = measurable.colorsInside.sort((a,b)=>b.value-a.value)
        const valuesSum=sortedColors.map(v=>v.value).reduce((a,b)=>a+b,0)
        function percentage(colors:ColorInside[]):number{
          if(valuesSum===0) return 100
          return Math.floor((colors.map(c=>c.value).reduce((a,b)=>a+b,0)/valuesSum)*100)
        }
        return ({
        ...measurable,
        ownership:[
          ...sortedColors.slice(0,2).map((colorInside)=>({
            color:this.colorsInsideDict[colorInside.id].colorCode,
            text:`${percentage([colorInside])}% cluster ${this.colorsInsideDict[colorInside.id].position+1}`,
            cluster:this.colorsInsideDict[colorInside.id].position+1
          })),
          ...(sortedColors.length>2?[{
            color:"#000000",
            text:`${percentage(sortedColors.slice(2))+1}% other`,
            cluster:0
          }]:[])
        ]
      })
      })
    }
  }

  get colorsInsideDict():Record<string,ColorInsideFullDescription>{
    const fullDescription:Record<string,ColorInsideFullDescription>={}
    this.colorInsideResume.forEach((value,index) => {
      fullDescription[value.id]={
        colorId: value.id,
        colorCode: this.calculateColor(value),
        position: index,
        value: value.value,
      }
    })
    return fullDescription
  }

  get colorInsideResume():ColorInside[]{
    console.log("calculating resume!!!!")
    let resume:Record<string,number>={}
    function addColorInside(color:ColorInside){
      resume[color.id]=color.value+(resume[color.id] ?? 0)
    }
    this.information.forEach((m:Measurable)=>m.colorsInside.forEach(addColorInside))
    return Object.entries(resume).map((entry)=>({
      id:entry[0],
      value:entry[1]
    })).sort((a,b)=>b.value-a.value)
  }

  calculateColor(colorInside: ColorInside): string {
    let seed = parseInt(colorInside.id.replace('c', ''))
    if (isNaN(seed)) {
        seed = 0
    }
    const hexColor = "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
    try {
        return Color(hexColor).darken(0.3).hex()
    } catch (e) {
        return Color(hexColor + "0").darken(0.3).hex()
    }
  }
}
</script>

<style>

</style>