import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { StoredStateInterface } from './state'
import { ipcRenderer } from "electron"
const actions: ActionTree<StoredStateInterface, StateInterface> = {
    setFilePath(context, path){
        ipcRenderer.send("setFilePath", path)
    },
    showVisualization(context,visualization){
        ipcRenderer.send("showVisualization",visualization)
    }
}

export default actions
