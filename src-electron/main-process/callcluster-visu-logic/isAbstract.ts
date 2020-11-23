import { Community } from "./types"
import getSubCommunities from "./getSubCommunities"
import getFunctions from "./getFunctions"
import isWritten from "./isWritten"
import { analysisJson } from "./globals"
export default function isAbstract(community: Community): boolean {
    return getSubCommunities(community).length == 0 && getFunctions(community).every(f => !isWritten(analysisJson["functions"][f]))
}