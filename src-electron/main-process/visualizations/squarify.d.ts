declare module 'treemap-squarify' {
    interface ConcreteTreemapResult {
        x: number,
        y: number,
        width: number,
        height: number,
    }
    interface HasValue {
        value: number
    }
    //type TreemapResult<T> = {...T, ...ConcreteTreemapResult}
    type TreemapResult<T> = {
        [P in keyof T]?: T[P];
    } & ConcreteTreemapResult
    /*
    EN REALIDAD ESTA ES UNA FUNCIÓN PARAMETRIZADA T CUYA DATA ES UN T CON VALUE Y DEVUELVE UNA EXPANSIÓN DE T
    */
    interface TreemapParams<T> {
        width: number,
        height: number
        data: T[],
    }
    export function getTreemap<T extends HasValue>(arg: TreemapParams<T>): [TreemapResult<T>];
}