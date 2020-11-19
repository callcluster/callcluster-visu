import { Measurable } from "./Measurable"
import { SubjectEvaluator } from "../../SubjectEvaluator"
import { analysisJson } from "../../globals"

export default function getMeasurableForFunction(id: number, evaluator: SubjectEvaluator): Measurable {
    const func = analysisJson.functions[id];
    return {
        ...func,
        id: `f${id}`,
        type: 'function',
        value: evaluator(func),
        name: func.name,
    }
}