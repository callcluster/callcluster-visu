import { Community } from "./types"
export default function getSubCommunities(c: Community): Community[] {
    if ("communities" in c) {
        return c.communities as Community[];
    } else {
        throw Error("Cannot get subcommunities of a community")
    }
}