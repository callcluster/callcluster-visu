import { FunctionId } from "./_types";
import { Measurable } from "./_measurables";

export default interface Node extends Measurable {
    functions: Set<FunctionId>
    parent: string
    color: string
}