import { CommunityIdentifier, Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside, ColorInside } from "./_measurables";
import Node from "./Node";
import Analyzable from "./_Analyzable";
import Colorer from "./_Colorer";
import Color from 'color'

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

function svgSurroundingAndDataUrl(code:string):string{
    const svg: string = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
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

function makeImageURL(subject: Measurable): string|undefined {
    if (subject.colorsInside.length==1){
        return svgSurroundingAndDataUrl(circleForColorinside(subject.colorsInside[0]))
    }else if (subject.colorsInside.length>1){
        return svgSurroundingAndDataUrl(calculatePieParts(subject).map(makePathForPiePart).join())
    } else {
        return undefined
    }
}

function subjectToNode(subject: Measurable, parent: Community, measurablesAnalyzer: MeasurablesAnalyzer, analyzable: Analyzable): Node {
    const imageUrl=makeImageURL(subject)
    return {
        ...subject,
        functions: measurablesAnalyzer.getAllFunctionsInside(subject),
        parent: analyzable.getStringIdentifier(parent),
        color: undefined,//analyzable.getColor(parent),
        shape:imageUrl===undefined?undefined:'image',
        image:imageUrl
    }
}
export default function getNodesInsideCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator, analyzable: Analyzable, colorer: Colorer | null): Node[] {

    const [nodesAnalyzer, subjects] = getMeasurablesInside(community, evaluator, analyzable, colorer)

    return subjects
        .filter(subject => !nodesAnalyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, nodesAnalyzer, analyzable))
}