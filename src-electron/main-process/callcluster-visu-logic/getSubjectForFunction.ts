import { PartialSubject } from "./PartialSubject"
import { SubjectEvaluator } from "./SubjectEvaluator"
import { analysisJson } from "./globals"

export default function getSubjectForFunction(id: number, evaluator: SubjectEvaluator): PartialSubject {
    const func = analysisJson.functions[id];
    return {
        ...func,
        id: `f${id}`,
        type: 'function',
        value: evaluator(func),
        name: func.name
    }
}