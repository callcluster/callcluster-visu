<template>
  <div class="column">
    <q-toolbar class="">
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
    </q-toolbar>
    <div class="col-grow relative-position overflow-hidden">
    <transition
        mode="out-in"
        enter-active-class="animated zoomIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
    <div :key="JSON.stringify(shownPaths)" class="absolute-full">
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
import { Vue, Component, Prop } from 'vue-property-decorator'
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
type PathItem = {
  name?:string,
  icon?:string,
  path:Array<string>
}
@Component
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

    get subjects () {
      return this.visualization?.subjects || []
    }

    get shownPaths ():Array<PathItem> {
      let arr:Array<PathItem> = (this.visualization.path || []).map((v, i, a) => ({
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
      const req = {
        ...this.visualization,
        path
      }
      delete req.subjects
      this.$emit('request', req)
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
