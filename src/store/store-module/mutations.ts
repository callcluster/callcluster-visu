import { MutationTree } from 'vuex'
import { StoredStateInterface } from './state'
const mutation: MutationTree<StoredStateInterface> = {
  setData (state:StoredStateInterface, payload:any) {
    state.calls = payload.calls || state.calls;
    state.functions = payload.functions || state.functions;
    state.minedCommunity = payload?.community || state?.minedCommunity;
  },
  createOrEditVisualization(state:StoredStateInterface,visualization:any){
    if(visualization.id==null){
      let keys:number[] = Object.keys(state.visualizations).map(s=>parseInt(s))
      let maxKey:number = keys.reduce((prev, curr) => Math.max(prev,curr),0) + 1;
      let nextVisualizations=Object.assign({},state.visualizations,{[maxKey]:visualization});
      state.visualizations = nextVisualizations;
    }else{
      state.visualizations = { ... state.visualizations, [visualization.id]:visualization}
    }
  },
  createCommunity(state:StoredStateInterface,community:any){
    state.communities = Object.assign(
      {},
      state.communities,
      {[community.id]:community}
    );
  },

  deleteVisualization (state:StoredStateInterface, id:number) {
    const visus = { ...state.visualizations }
    delete visus[id]
    state.visualizations = visus
  }
}

export default mutation
