import { CommunityIdentifier } from "./_types";

interface GeneralVisualization {
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
}

export default interface Visualization extends GeneralVisualization{
    root:CommunityIdentifier
}

export interface RootlessVisualization extends GeneralVisualization {
    root?:CommunityIdentifier
}