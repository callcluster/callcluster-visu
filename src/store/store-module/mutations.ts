import { MutationTree } from 'vuex'
import { StoredStateInterface } from './state'
const mutation: MutationTree<StoredStateInterface> = {
  setData (state:StoredStateInterface, payload:any) {
    state.calls = payload.calls || state.calls;
    state.functions = payload.functions || state.functions;
    state.minedCommunity = payload?.community || state?.minedCommunity;
  }
}

export default mutation
