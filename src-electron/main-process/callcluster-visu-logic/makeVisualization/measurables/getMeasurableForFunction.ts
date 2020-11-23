import { Measurable } from "./Measurable"
import { SubjectEvaluator } from "./_makeEvaluator"
import Analyzable from "./_Analyzable";

export default function getMeasurableForFunction(id: number, evaluator: SubjectEvaluator, analyzable:Analyzable): Measurable {
    const func = analyzable.getFunction(id)
    return {
        ...func,
        id: `f${id}`,
        type: 'function',
        value: evaluator(func),
        name: func.name,
    }
}