import { Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import getMeasurableForFunction from "./getMeasurableForFunction";
import getMeasurableForCommunity from "./getMeasurableForCommunity";
import { Measurable } from "./Measurable";
import isWritten from "../../isWritten";
import isAbstract from "../../isAbstract";
import MeasurablesAnalyzer from "./MeasurablesAnalyzer";
import Analyzable from "./_Analyzable";
export default function getMeasurablesInside(community: Community, evaluator: SubjectEvaluator, analyzable:Analyzable): [MeasurablesAnalyzer, Measurable[]] {
    return [new MeasurablesAnalyzer(analyzable), [
        ...analyzable.getFunctionsInside(community)
            .filter(fid => isWritten(analyzable.getFunction(fid)))
            .map(id => getMeasurableForFunction(id, evaluator,analyzable)),
        ...analyzable.getSubCommunities(community)
            .filter(c => !isAbstract(c,analyzable))
            .map(c => getMeasurableForCommunity(c, evaluator, analyzable)),
    ]]
}