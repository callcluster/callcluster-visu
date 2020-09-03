import { store } from 'quasar/wrappers'
import Vuex from 'vuex'

import fullDataModule from './store-module'
import { StoredStateInterface } from './store-module/state'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  example: StoredStateInterface;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      data:fullDataModule
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return Store
})

import {register as registerProxy} from './proxy'
export {
  registerProxy
}
