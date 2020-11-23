import { Community } from "./types";
export default function getFunctions(community: Community): number[] {
    if ("functions" in community) {
        return community["functions"] as number[]
    } else {
        throw Error("This community has no functions")
    }
}
