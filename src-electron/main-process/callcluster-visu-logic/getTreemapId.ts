import { Community } from "./types"
export default function getTreemapId(community: Community) {
    if ("_treemap_id" in community) {
        return community["_treemap_id"] as number
    } else {
        throw Error("This community has no treemap id")
    }
}