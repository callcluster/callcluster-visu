<template>
  <div class="column">
    <q-toolbar class="">
      <path-navigator :path="path" @change="changePath"/>
    </q-toolbar>
    <div class="col-grow relative-position overflow-hidden">
    <transition
        mode="out-in"
        enter-active-class="animated zoomIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
    <div :key="JSON.stringify(path)" class="absolute-full">
        <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        >
          <g
            v-for="(subject,index) in subjects"
            :key="index"
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
              @dblclick="navigate(subject)"
              @click="select(subject)"
              rx="2"
              />
            <text
              :x="(subject.x + subject.width / 2)"
              :y="(subject.y + subject.height / 2)"
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
              :x="subject.x"
              :y="subject.y"
              :width="subject.width"
              :height="subject.height"
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
type SubjectData = {
  name:string,
  value:number,
  type:string
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
  path?:Array<string>,
  parameters:Record<string, string>
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
      path: [...(this.visualization.path || []), subject.data.name]
    }
    delete req.subjects
    this.$emit('request', req)
  }


  changePath(path:Array<string>){
    const req = {
      ...this.visualization,
      openedCommunities:[],
      path
    }
    this.$emit('request', req)
  }

  get subjects () {
    return this.visualization?.subjects || []
  }

  get path():Array<string> {
    return this.visualization.path || []
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
