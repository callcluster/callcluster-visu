import { PartialSubject } from "./_measurables";

export default interface Node extends PartialSubject {
    functions: Set<number>
    parent: string
    color: string
}