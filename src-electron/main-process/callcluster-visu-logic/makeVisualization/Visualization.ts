import { CommunityIdentifier } from "./_types";

export default interface Visualization {
    visualizationType: string,
    id: number,
    parameters: {
        scaling: string,
        metric: string,
        community:{
            label:string,
            value:number
        }
    }
    root?:CommunityIdentifier
}