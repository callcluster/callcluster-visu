import {Metric, Community, Function} from "./globals"
export default function getMetric(subject: Function | Community, metric: Metric): number {
    if (metric in subject) {
        return subject[metric] as number
    } else {
        throw Error("This metric doesn't exist within this subject. Metric:" + metric+" subject: "+JSON.stringify(subject))
    }
}