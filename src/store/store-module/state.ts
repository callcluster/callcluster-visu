export interface StoredStateInterface {
  minedCommunity?:any
  functions?:Array<any>
  calls?:Array<any>
  visualizations:Record<number,any>
}

const state: StoredStateInterface = {
  minedCommunity: null,
  functions: [],
  calls: [],
  visualizations: {}
}

export default state
