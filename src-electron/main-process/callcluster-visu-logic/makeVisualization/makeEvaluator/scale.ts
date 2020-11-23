export type Scaling = string;

export default function scale(scaling: Scaling, num: number) {
    if (scaling === 'log10') {
        return Math.log10(num)
    } else if (scaling === 'log2') {
        return Math.log2(num)
    }
    return num
}