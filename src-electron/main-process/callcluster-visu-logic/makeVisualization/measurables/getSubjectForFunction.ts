import { Measurable } from "./PartialSubject"
import { SubjectEvaluator } from "../../SubjectEvaluator"
import { analysisJson } from "../../globals"

export default function getSubjectForFunction(id: number, evaluator: SubjectEvaluator): Measurable {
    const func = analysisJson.functions[id];
    return {
        ...func,
        id: `f${id}`,
        type: 'function',
        value: evaluator(func),
        name: func.name,
        //functions: new Set([id]),
    }
}