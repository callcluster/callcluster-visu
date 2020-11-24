import Analyzable from "./_Analyzable";
import { InfoQuery, isCommunityQuery, isFunctionQuery } from "./types";

export default function getInfoFor(data:InfoQuery, analyzable:Analyzable):Record<string,string|number> {
    if (isFunctionQuery(data)) {
        const fid = parseInt((data.id + "").replace("f", ""));
        return { ...analyzable.getFunction(fid), type: 'function' }
    } else if(isCommunityQuery(data)) {
        let info = { ...analyzable.getCommunity(data._treemap_id) }
        delete info.functions
        delete info.communities
        return {
            ...info,
            type: (info['type'] as string) || 'community'
        }
    } else {
        throw new Error("The query has no type "+JSON.stringify(data))
    }
}