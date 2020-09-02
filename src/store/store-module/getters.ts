import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { StoredStateInterface } from './state'

const getters: GetterTree<StoredStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default getters
