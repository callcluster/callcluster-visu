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
    },
}

export interface Colorer {
    label:string,
    value:number
}

export interface ClusteredVisualization {
    coloringParameters?:{
        leftColorer:Colorer|null
        rightColorer:Colorer|null
    }
}

export default interface Visualization extends GeneralVisualization, ClusteredVisualization {
    root:CommunityIdentifier
}

export interface RootlessVisualization extends GeneralVisualization {
    root?:CommunityIdentifier
}