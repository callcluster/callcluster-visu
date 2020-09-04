export interface StoredStateInterface {
  minedCommunity?:any
  functions?:any
  calls?:any
}

const state: StoredStateInterface = {
  minedCommunity:{},
  functions:[],
  calls:[]
}

export default state
