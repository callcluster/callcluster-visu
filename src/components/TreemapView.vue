<template>
    <div >
        <q-toolbar>
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
        
        <div class="full-height">
            <svg width="100%" height="100%" >
                <g v-for="subject in visualization.subjects || []">
                    <rect
                        :x="subject.x+'%'"
                        :y="subject.y+'%'"
                        :width="subject.width+'%'"
                        :height="subject.height+'%'"
                        style="stroke-width:1;stroke:white"
                        :class="(
                            (selectedSubject == subject)?'selected':'unselected'
                            )"
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
        </div>
    </div>
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
type PathItem = {
    name?:string,
    icon?:string,
    path:Array<string>
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
    get shownPaths():Array<PathItem>{
        let arr:Array<PathItem> = (this.visualization.path || []).map((v,i,a)=>({
            name:v,
            path:a.slice(0,i+1)
        }));
        arr = [ {
            icon:"home",
            path:[]
        }, ...arr]
        return arr.slice(Math.max(0,arr.length-5));
    }
    clickShown(path:Array<string>){
        let req={
            ...this.visualization,
            path
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