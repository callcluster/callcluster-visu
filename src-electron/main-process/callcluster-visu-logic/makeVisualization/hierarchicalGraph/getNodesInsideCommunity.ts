import { CommunityIdentifier, Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside, ColorInside } from "./_measurables";
import Node from "./Node";
import Analyzable from "./_Analyzable";
import Colorer from "./_Colorer";
import Color from 'color'
import { removeCssText } from "vis-util/esnext";

type PiePart = {
    color: string,
    startAngle: number,
    endAngle: number
}

function calculateColor(colorInside: ColorInside): string {
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

function calculatePieParts(subject: Measurable): PiePart[] {
    const colors = subject.colorsInside
    const total = colors.map(c => c.value).reduce((a, b) => a + b, 0)
    const colorsWithDelta = colors.map((colorInside) => ({
        color: calculateColor(colorInside),
        angleDelta: colorInside.value / total * 360
    }))

    let angleSum = 0
    const parts: PiePart[] = []
    for (let colorWithDelta of colorsWithDelta) {
        parts.push({
            color: colorWithDelta.color,
            startAngle: angleSum,
            endAngle: angleSum + colorWithDelta.angleDelta
        })
        angleSum += colorWithDelta.angleDelta
    }

    console.log(parts)
    return parts;
}

function dForPie(centerX: number, centerY: number, angleBegin: number, angleEnd: number, radius: number): string {
    function calculatePoint(angle: number) {
        const radians = angle / 180 * Math.PI
        return {
            x: Math.cos(radians) * radius + centerX,
            y: -Math.sin(radians) * radius + centerY,
        }
    }
    const begin = calculatePoint(angleBegin)
    const end = calculatePoint(angleEnd)
    const largeArcFlag = (angleEnd - angleBegin >= 180) ? 1 : 0
    return `M ${begin.x} ${begin.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${centerX} ${centerY}`
}

function makePathForPiePart(piePart: PiePart): string {
    return `<path 
        fill="${piePart.color}"
        d="${dForPie(50, 50, piePart.startAngle, piePart.endAngle, 50)}"
    />`
}

function svgSurroundingAndDataUrl(code:string,large:boolean=true):string{
    const viewBox=large?"-5 -5 110 110":"0 0 100 100";
    const svg: string = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="${viewBox}">
        <g>
            ${code}
        </g>
    </svg>
    `
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function circleForColorinside(colorInside:ColorInside):string{
    return `<circle cx="50" cy="50" r="50" fill="${calculateColor(colorInside)}" />`
}
function circleForColor(color:string):string{
    return `<circle cx="50" cy="50" r="50" fill="${color}" />`
}
type ImageURLs = {
    selected:string
    unselected:string
}
function clip(content:string,clipper:string|undefined):string{
    if(clipper===undefined){
        return content
    }else{
        return `
        <g style="clip-path:url(#shape);">
            ${content}
        </g>
        <defs>
            <clipPath id="shape">
                ${clipper}
            </clipPath>
        </defs>
        `
    }
    
}
function regularShape(vertices:number):string{
    interface Point{x:number,y:number}
    const points:Point[]=new Array(vertices).fill(null).map((_,i)=>({
        x: 50 + Math.cos( i / vertices * 2 * Math.PI ) * 50,
        y: 50 + Math.sin( i / vertices * 2 * Math.PI ) * 50,
    }))
    return `<polygon points="${points.map(p=>`${p.x},${p.y}`).join(' ')}" />`
}
function getClipperFor(subject:Measurable):string|undefined{
    if(subject["minlevel"]===undefined){ //subject is a function or has no minlevel
        return undefined
    }
    const shapes:Record<number,string> = {
        1:regularShape(3),
        2:regularShape(4),
        3:regularShape(5),
        4:regularShape(6),
        5:regularShape(7),
        6:regularShape(8),
    }
    if(typeof subject["minlevel"] === "number"){
        return shapes[subject["minlevel"] ?? 0]
    }else{
        return undefined
    }
    
}
const surroundingCircle:string=`<circle cx="50" cy="50" r="52" stroke="#26A69A" stroke-width="3" fill="none" />`
function makeImageURLs(subject: Measurable): ImageURLs|undefined {
    function makeReturn(content:string):ImageURLs{
        const clipper = getClipperFor(subject)
        return {
            selected:svgSurroundingAndDataUrl(clip(content,clipper)+surroundingCircle,true),
            unselected:svgSurroundingAndDataUrl(clip(content,clipper))
        }
    }
    if (subject.colorsInside.length==1){
        return makeReturn(circleForColorinside(subject.colorsInside[0]))
        
    }else if (subject.colorsInside.length>1){
        return makeReturn(calculatePieParts(subject).map(makePathForPiePart).join())
    } else if(typeof subject["color"] === "string" ){
        return makeReturn(circleForColor(subject["color"]))
    }
}

function subjectToNode(subject: Measurable, parent: Community, measurablesAnalyzer: MeasurablesAnalyzer, analyzable: Analyzable): Node {
    const color = analyzable.getColor(parent)
    const imageUrls=makeImageURLs({
        ...subject,
        color
    })
    const retVal = {
        ...subject,
        functions: measurablesAnalyzer.getAllFunctionsInside(subject),
        parent: analyzable.getStringIdentifier(parent),
        color
    }
    if(imageUrls!==undefined){
        (retVal as any).shape='image';
        (retVal as any).image=imageUrls
    }

    return retVal
}
export default function getNodesInsideCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator, analyzable: Analyzable, colorer: Colorer | null): Node[] {

    const [nodesAnalyzer, subjects] = getMeasurablesInside(community, evaluator, analyzable, colorer)

    return subjects
        .filter(subject => !nodesAnalyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, nodesAnalyzer, analyzable))
}