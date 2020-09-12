import { MutationTree } from 'vuex'
import { StoredStateInterface } from './state'
const mutation: MutationTree<StoredStateInterface> = {
  setData (state:StoredStateInterface, payload:any) {
    state.calls = payload.calls || state.calls;
    state.functions = payload.functions || state.functions;
    state.minedCommunity = payload?.community || state?.minedCommunity;
  },
  createVisualization(state:StoredStateInterface,visualization:any){
    let keys:number[] = Object.keys(state.visualizations).map(s=>parseInt(s))
    let maxKey:number = keys.reduce((prev, curr) => Math.max(prev,curr),0) + 1;
    let nextVisualizations=Object.assign({},state.visualizations,{[maxKey]:visualization});
    state.visualizations = nextVisualizations;
  },
}

export default mutation
