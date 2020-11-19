import { Measurable } from "./_measurables";

export default interface Node extends Measurable {
    functions: Set<number>
    parent: string
    color: string
}