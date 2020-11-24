import { Community } from "./types"
import getSubCommunities from "./getSubCommunities"
import getFunctionsInside from "./getFunctionsInside"
import isWritten from "./isWritten"
import { analysisJson } from "./globals"
export default function isAbstract(community: Community): boolean {
    return getSubCommunities(community).length == 0 && getFunctionsInside(community).every(f => !isWritten(analysisJson["functions"][f]))
}