
<template>
  <div class="column">
    <q-toolbar class="">
      <path-navigator :path="path" @change="changeRoot"/>
    </q-toolbar>
    <div class="col-grow relative-position overflow-hidden">
    <transition
        mode="out-in"
        enter-active-class="animated zoomIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
    <div :key="root" class="absolute-full">
        <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        >
        
          <g
            v-for="(subject,index) in subjects"
            :key="index"
            @dblclick="navigate(subject)"
            @click="select(subject)"
          >
          <rect
              :x="subject.x"
              :y="subject.y"
              :width="subject.width"
              :height="subject.height"
              style="stroke-width:0.5;stroke:white"
              :class="(
                  (selectedSubject == subject)?'selected':'unselected'
                  )"
              rx="2"
              v-if="numberOfColorsInside(subject)===0"
            />
          <path 
              :fill="piePart.color"
              :d="dForPie(circleX(subject),circleY(subject),piePart.startAngle,piePart.endAngle,100)"
              :style="`clip-path: url(#path-${index}); -webkit-clip-path: url(#path-${index});`"
              v-if="numberOfColorsInside(subject)>1"
              v-for="piePart in calculatePieParts(subject)"
            />
          <rect
              :x="subject.x"
              :y="subject.y"
              :width="subject.width"
              :height="subject.height"
              :style="`clip-path: url(#path-${index}); -webkit-clip-path: url(#path-${index});`"
              :fill="calculatePieParts(subject)[0].color"
              v-if="numberOfColorsInside(subject)===1"
            />
            
            <text
              :x="circleX(subject)"
              :y="circleY(subject)"
              fill="white"
              class="svgText"
              :style="`clip-path: url(#path-${index}); -webkit-clip-path: url(#path-${index});`"
              >
              {{subject.data.name}}
            </text>
          </g>
          <defs>
            <clipPath
            v-for="(subject,index) in subjects"
            :key="index"
            :id="`path-${index}`"
            >
            <rect
              :x="subject.x+0.5"
              :y="subject.y+0.5"
              :width="subject.width-1"
              :height="subject.height-1"
              rx="2"
              />
            </clipPath>
            
          </defs>
          Sorry, your browser does not support inline SVG.
        </svg>
    </div>
    </transition>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PathNavigator from 'components/PathNavigator.vue'
import Color from 'color'

type PiePart = {
  color:string,
  startAngle:number,
  endAngle:number
}
type ColorInside = {
  id:string,
  value:number
}
type SubjectData = {
  name:string,
  value:number,
  type:string,
  id:string,
  colorsInside:ColorInside[]
}
type Subject = {
  height:number,
  width:number,
  x:number,
  y:number,
  data:SubjectData,
  selected:boolean,
}
type TreemapVisualization = {
  subjects?:Array<Subject>,
  id:number,
  visualizationType:'treemap',
  root?:string,
  parameters:Record<string, string>,
  parents?:Array<{ id:string, name:string }>
}
@Component({
  components:{PathNavigator}
})
export default class TreemapView extends Vue {
  @Prop({ required: true, type: Object }) visualization!:TreemapVisualization;
  selectedSubject:Subject|null=null;
  select (subject:Subject) {
    if (this.selectedSubject === subject) {
      this.selectedSubject = null
    } else {
      this.selectedSubject = subject
      this.$emit('select', subject.data)
    }
  }

  navigate (subject:Subject) {
    if (subject.data.type === 'function') {
      return
    }
    const req = {
      ...this.visualization,
      root: subject.data.id
    }
    delete req.subjects
    this.$emit('request', req)
  }

  numberOfColorsInside(subject:Subject):number {
    return subject.data.colorsInside.length
  }

  changeRoot(newRoot:string){
    const req = {
      ...this.visualization,
      openedCommunities:[],
      root:newRoot
    }
    this.$emit('request', req)
  }

  calculatePieParts(subject:Subject):PiePart[]{
    const colors = subject.data.colorsInside
    const total = colors.map(c => c.value).reduce((a, b) => a + b, 0)
    const colorsWithDelta = colors.map((colorInside)=>({
      color:this.calculateColor(colorInside),
      angleDelta:colorInside.value/total*360
    }))

    let angleSum=0
    const parts:PiePart[]=[]
    for(let colorWithDelta of colorsWithDelta){
      parts.push({
        color:colorWithDelta.color,
        startAngle:angleSum,
        endAngle:angleSum + colorWithDelta.angleDelta
      })
      angleSum+= colorWithDelta.angleDelta
    }
    
    console.log(parts)
    return parts;
  }

  calculateColor(colorInside: ColorInside): string {
    let seed = parseInt(colorInside.id.replace('c',''))
    if(isNaN(seed)){
      seed=0
    }
    const hexColor = "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
    try{
      return Color(hexColor).darken(0.3).hex()
    } catch(e){
      return Color(hexColor+"0").darken(0.3).hex()
    }
  }

  circleX(subject:Subject):number{
    return subject.x+subject.width/2
  }

  circleY(subject:Subject):number{
    return subject.y+subject.height/2
  }

  circleRadius(subject:Subject):number{
    return Math.max(subject.height, subject.width)
  }

  dForPie(centerX:number,centerY:number,angleBegin:number,angleEnd:number,radius:number):string{
    function calculatePoint(angle:number){
      const radians=angle/180*Math.PI
      return {
        x:Math.cos(radians)*radius+centerX,
        y:-Math.sin(radians)*radius+centerY,
      }
    }
    const begin=calculatePoint(angleBegin)
    const end=calculatePoint(angleEnd)
    const largeArcFlag=(angleEnd-angleBegin>=180)?1:0
    return `M ${begin.x} ${begin.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${centerX} ${centerY}`
  }

  get subjects () {
    return this.visualization?.subjects || []
  }

  get root():string|null {
    return this.visualization.root??null
  }

  get path():Array<{ id:string, name:string }>{
    return this.visualization.parents??[]
  }
}
</script>

<style scoped >
.svgText {
  pointer-events: none;
  user-select: none;
  text-anchor: middle;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color:#fafafa;
  font-size: 2px;
}
.selected {
  fill: var(--q-color-secondary);
}
.unselected {
  fill: var(--q-color-primary);
}
</style>
