<template>
  <svg width="100%" height="100%">
    <g v-for="subject in visualization.subjects">
        <rect
            :x="subject.x+'%'"
            :y="subject.y+'%'"
            :width="subject.width+'%'"
            :height="subject.height+'%'"
            style="stroke-width:1;stroke:white"
            :class="(selectedSubject == subject)?'selected':'unselected'"
            @dblclick="navigate(subject)"
            @click="select(subject)"
            />
        <text
            :x="(subject.x + subject.width / 2)+'%'"
            :y="(subject.y + subject.height / 2)+'%'"
            fill="white"
            class="svgText"
            >
            {{subject.data.name}}
        </text>
    </g>
    Sorry, your browser does not support inline SVG.
</svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
type SubjectData = {
    name:string,
    value:number
}
type Subject = {
    height:number,
    width:number,
    x:number,
    y:number,
    data:SubjectData,
    selected:boolean
}
type TreemapVisualization = {
    subjects?:Array<Subject>,
    id:number,
    visualizationType:"treemap",
    path?:Array<string>,
    parameters:object
}
@Component
export default class TreemapView extends Vue {
    @Prop({required:true,type:Object}) visualization!:TreemapVisualization;
    selectedSubject:Subject|null=null;
    select(subject:Subject){
        if(this.selectedSubject==subject){
            this.selectedSubject=null;
        }else{
            this.selectedSubject=subject;
        }
    }
    navigate(subject:Subject){
        let req={
            ...this.visualization,
            path:[...(this.visualization.path||[]), subject.data.name]
        }

        delete req.subjects;
        this.$emit('request',req)
    }
}
</script>

<style scoped >
.svgText {
    pointer-events: none;
    user-select: none;
}
.selected {
    fill: aqua;
}
.unselected {
    fill: blue;
}
</style>