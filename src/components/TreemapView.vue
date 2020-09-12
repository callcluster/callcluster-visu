<template>
  <svg width="100%" height="100%">
    <g v-for="rectangle in rectangles" fill="grey">
        <rect
            :x="rectangle[0]+'%'"
            :y="rectangle[1]+'%'"
            :width="rectangle[2]+'%'"
            :height="rectangle[3]+'%'"
            style="stroke-width:1;stroke:white"/>
        <text
            :x="(rectangle[0] + rectangle[2] / 2)+'%'"
            :y="(rectangle[1] + rectangle[3] / 2)+'%'"
            fill="white">
            holis
        </text>
    </g>
    Sorry, your browser does not support inline SVG.
</svg>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import d3 from "d3";
@Component
export default class TreemapView extends Vue {
    rectangles=[
        [0,0,20,30],
        [20,0,20,30],
        [20,30,20,30]
    ]
}
</script>

<style>

</style>