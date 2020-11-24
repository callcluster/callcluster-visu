import { Community } from "./types"
import getFunctionsInside from "./getFunctionsInside"
import isWritten from "./isWritten"
import { analysisJson } from "./globals"
import Analyzable from "./makeVisualization/_Analyzable"
export default function isAbstract(community: Community, analyzable:Analyzable): boolean {
    return analyzable.getSubCommunities(community).length == 0 && getFunctionsInside(community).every(f => !isWritten(analysisJson["functions"][f]))
}