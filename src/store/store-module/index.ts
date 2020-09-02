import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { StoredStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const fullDataModule: Module<StoredStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default fullDataModule
