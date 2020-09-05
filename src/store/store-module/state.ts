export interface StoredStateInterface {
  minedCommunity?:any
  functions?:Array<any>
  calls?:Array<any>
}

const state: StoredStateInterface = {
  minedCommunity: null,
  functions: [],
  calls: []
}

export default state
