export type Scaling = string;

export default function scale(scaling: Scaling, num: number|undefined) {
    if( num === undefined){
        return undefined
    } else if (scaling === 'log10') {
        return Math.log10(num)
    } else if (scaling === 'log2') {
        return Math.log2(num)
    }
    return num
}