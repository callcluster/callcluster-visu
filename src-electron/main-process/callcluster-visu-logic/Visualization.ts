export default interface Visualization {
    visualizationType: string,
    id: number,
    parameters: {
        scaling: string,
        metric: string
    }
}