import { Measurable } from "./Measurable"
import { SubjectEvaluator } from "./_makeEvaluator"
import Analyzable from "./_Analyzable";
import { FunctionId } from "./_types";
import Colorer from "./_Colorer";

export default function getMeasurableForFunction(id: FunctionId, evaluator: SubjectEvaluator, analyzable:Analyzable, colorer:Colorer|null): Measurable {
    const func = analyzable.getFunction(id)
    return {
        ...func,
        id: analyzable.getStringIdentifier(id),
        type: 'function',
        value: evaluator(func),
        name: func.name,
        colorsInside: [analyzable.getColorForFunction(id, evaluator,colorer)]
    }
}