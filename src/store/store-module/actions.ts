import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { StoredStateInterface } from './state'
import { ipcRenderer } from "electron"
const actions: ActionTree<StoredStateInterface, StateInterface> = {
  setFilePath (_, path) {
    ipcRenderer.send("setFilePath", path)
  },
  showVisualization (_, visualization) {
    ipcRenderer.send("showVisualization", visualization)
  },
  selectObject (_, data) {
    ipcRenderer.send("selectObject", data)
  },
  extractCommunity(_,payload){
    ipcRenderer.send("extractCommunity", payload)
  },
  renameCommunity(_,payload){
    ipcRenderer.send("renameCommunity", payload)
  }
}

export default actions
